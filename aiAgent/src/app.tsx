import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Static, Text, useApp, useInput, useStdout } from "ink";
import TextInput from "ink-text-input";
import { render } from "ink";

import { runAgentLoop } from "./agents/agent.js";
import projectConfig from "./config/project.config.js";


export type AgentEvent =
  | { type: "text"; text: string }
  | { type: "tool"; label: string }
  | { type: "tool_end"; label?: string; detail?: string; ok?: boolean }
  | { type: "status"; label: string }
  | { type: "error"; text: string };

export type AgentEmit = (event: string | AgentEvent) => void;

export const messageQueue: string[] = [];

type Row =
  | { id: string; kind: "banner" }
  | { id: string; kind: "user"; text: string }
  | { id: string; kind: "assistant"; text: string }
  | { id: string; kind: "tool"; text: string; detail?: string; ok: boolean }
  | { id: string; kind: "error"; text: string }
  | { id: string; kind: "note"; text: string };

/** Omit over a union has to be distributed, or it collapses to `kind`. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

type NewRow = DistributiveOmit<Row, "id">;

const ACCENT = "white";
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const BANNER = [
  "███████╗███╗   ███╗ ██████╗",
  "██╔════╝████╗ ████║██╔════╝",
  "█████╗  ██╔████╔██║██║     ",
  "██╔══╝  ██║╚██╔╝██║██║     ",
  "███████╗██║ ╚═╝ ██║╚██████╗",
  "╚══════╝╚═╝     ╚═╝ ╚═════╝",
].join("\n");

let rowSeq = 0;
const nextId = () => `r${++rowSeq}`;

const asEvent = (event: string | AgentEvent): AgentEvent =>
  typeof event === "string" ? { type: "text", text: event } : event;

const formatDuration = (ms: number) =>
  ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;

/** Spinner frame that only advances while `active`. */
function useSpinner(active: boolean) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!active) {
      setFrame(0);
      return;
    }
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % SPINNER.length);
    }, 80);
    return () => clearInterval(timer);
  }, [active]);

  return SPINNER[frame];
}

/** Whole seconds since `startedAt`; ticks while it is non-null. */
function useElapsed(startedAt: number | null) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setSeconds(0);
    if (startedAt === null) return;

    const timer = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
    return () => clearInterval(timer);
  }, [startedAt]);

  return seconds;
}

/* ------------------------------------------------------------------ *
 * Header. Rendered as the first Static row so it scrolls away with the
 * transcript instead of being repainted above the composer forever.
 * ------------------------------------------------------------------ */
function Header() {
  const cfg = projectConfig as unknown as Record<string, unknown> | undefined;
  const model = (cfg?.["model"] ?? cfg?.["defaultModel"]) as string | undefined;
  const home = process.env["HOME"] ?? process.env["USERPROFILE"];
  const cwd = home ? process.cwd().replace(home, "~") : process.cwd();

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text color={"white"}>{BANNER}</Text>
      <Box marginTop={1}>
        <Text bold>EMC </Text>
        <Text dimColor>Autonomous Coding Agent</Text>
      </Box>
      <Text dimColor>
        {cwd} {model ? `  ·  ${model}` : ""}
      </Text>
      <Box marginTop={1}>
        <Text dimColor>Describe a task, or /help for commands.</Text>
      </Box>
    </Box>
  );
}

function Bullet({ char, color }: { char: string; color: string }) {
  return <Text color={color}>{char} </Text>;
}

function TranscriptRow({ row }: { row: Row }) {
  if (row.kind === "banner") return <Header />;

  if (row.kind === "note") {
    return (
      <Box marginBottom={1} paddingLeft={2}>
        <Text dimColor>{row.text}</Text>
      </Box>
    );
  }

  const bullet =
    row.kind === "user"
      ? { char: "›", color: ACCENT }
      : row.kind === "assistant"
        ? { char: "⏺", color: ACCENT }
        : row.kind === "error"
          ? { char: "✘", color: "red" }
          : { char: row.ok ? "✔" : "✘", color: row.ok ? "green" : "red" };

  const body =
    row.kind === "tool"
      ? `${row.text}${row.detail ? ` — ${row.detail}` : ""}`
      : row.text;

  return (
    <Box marginBottom={1}>
      <Bullet char={bullet.char} color={bullet.color} />
      <Box flexGrow={1}>
        {row.kind === "error" ? (
          <Text color="red" wrap="wrap">
            {body}
          </Text>
        ) : (
          <Text dimColor={row.kind === "tool"} wrap="wrap">
            {body}
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default function App() {
  const { exit } = useApp();
  const { stdout } = useStdout();

  const [generation, setGeneration] = useState(0);
  const [rows, setRows] = useState<Row[]>([{ id: nextId(), kind: "banner" }]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [settling, setSettling] = useState(false);
  const [statusLabel, setStatusLabel] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [queuedCount, setQueuedCount] = useState(0);

  const spinner = useSpinner(running || settling);
  const elapsed = useElapsed(startedAt);

  // Bumped on interrupt so callbacks from an abandoned run are ignored.
  const runIdRef = useRef(0);
  const cancelledRef = useRef(false);
  const pumpingRef = useRef(false);
  const toolStartedAtRef = useRef(0);
  const toolLabelRef = useRef<string | null>(null);

  const append = useCallback((row: NewRow) => {
    setRows((prev) => [...prev, { ...row, id: nextId() } as Row]);
  }, []);

  const handleEvent = useCallback(
    (raw: string | AgentEvent) => {
      const event = asEvent(raw);

      switch (event.type) {
        case "text": {
          const text = event.text?.trim();
          if (text) append({ kind: "assistant", text });
          return;
        }
        case "tool": {
          toolStartedAtRef.current = Date.now();
          toolLabelRef.current = event.label;
          setStatusLabel(event.label);
          return;
        }
        case "status": {
          setStatusLabel(event.label);
          return;
        }
        case "tool_end": {
          const label = event.label ?? toolLabelRef.current ?? "Tool";
          const took = toolStartedAtRef.current
            ? formatDuration(Date.now() - toolStartedAtRef.current)
            : "";
          const detail = [event.detail, took].filter(Boolean).join(" · ");
          append({
            kind: "tool",
            text: label,
            ok: event.ok !== false,
            ...(detail ? { detail } : {}),
          });
          toolStartedAtRef.current = 0;
          toolLabelRef.current = null;
          setStatusLabel(null);
          return;
        }
        case "error": {
          append({ kind: "error", text: event.text });
          setStatusLabel(null);
          return;
        }
      }
    },
    [append],
  );

  const runOne = useCallback(
    async (prompt: string) => {
      const runId = ++runIdRef.current;
      cancelledRef.current = false;

      setRunning(true);
      setStartedAt(Date.now());
      setStatusLabel(null);

      try {
        await runAgentLoop(prompt, (output: string) => {
          if (cancelledRef.current || runId !== runIdRef.current) return;
          handleEvent(output as string | AgentEvent);
        });
      } catch (error) {
        if (!cancelledRef.current && runId === runIdRef.current) {
          append({
            kind: "error",
            text: error instanceof Error ? error.message : String(error),
          });
        }
      } finally {
        // A newer runId means we were interrupted; don't clobber that state.
        if (runId === runIdRef.current) {
          setRunning(false);
          setStartedAt(null);
          setStatusLabel(null);
        }
      }
    },
    [append, handleEvent],
  );

  /** Drains messageQueue serially so two agent runs never overlap. */
  const pump = useCallback(async () => {
    if (pumpingRef.current) return;
    pumpingRef.current = true;
    try {
      while (messageQueue.length > 0) {
        const next = messageQueue.shift() as string;
        setQueuedCount(messageQueue.length);
        await runOne(next);
      }
    } finally {
      pumpingRef.current = false;
      setSettling(false);
      setQueuedCount(messageQueue.length);
      if (messageQueue.length > 0) void pump();
    }
  }, [runOne]);

  const handleCommand = useCallback(
    (command: string) => {
      const name = command.slice(1).split(/\s+/)[0] ?? "";

      switch (name) {
        case "clear":
          stdout?.write("\x1b[2J\x1b[3J\x1b[H");
          rowSeq = 0;
          setRows([{ id: nextId(), kind: "banner" }]);
          // Remount Static: it only ever prints items it hasn't seen, so a
          // shorter array would otherwise render nothing at all.
          setGeneration((g) => g + 1);
          return;
        case "help":
          append({
            kind: "note",
            text: [
              "/clear   reset the transcript",
              "/help    this list",
              "/exit    quit EMC",
              "esc      interrupt the current run",
              "ctrl+c   quit",
            ].join("\n"),
          });
          return;
        case "exit":
        case "quit":
          exit();
          return;
        default:
          append({ kind: "error", text: `Unknown command: /${name}` });
          return;
      }
    },
    [append, exit, stdout],
  );

  const handleSubmit = useCallback(
    (value: string) => {
      const prompt = value.trim();
      if (!prompt) return;

      setInput("");

      if (prompt.startsWith("/")) {
        handleCommand(prompt);
        return;
      }

      append({ kind: "user", text: prompt });
      messageQueue.push(prompt);
      setQueuedCount(messageQueue.length);
      void pump();
    },
    [append, handleCommand, pump],
  );

  useInput((_char, key) => {
    if (!key.escape) return;

    if (running) {
      // Detach from the in-flight run. Without an AbortSignal in
      // runAgentLoop we can only stop listening, not stop the work, so
      // the queue stays paused until that promise settles.
      cancelledRef.current = true;
      runIdRef.current += 1;

      const dropped = messageQueue.length;
      messageQueue.length = 0;

      setQueuedCount(0);
      setRunning(false);
      setStartedAt(null);
      setStatusLabel(null);
      setSettling(pumpingRef.current);
      append({
        kind: "note",
        text: dropped
          ? `Interrupted · ${dropped} queued prompt${dropped === 1 ? "" : "s"} discarded`
          : "Interrupted",
      });
      return;
    }

    if (input) setInput("");
  });

  const composerDisabled = running || settling;

  return (
    <Box flexDirection="column">
      {/* Committed transcript. Printed once and then owned by the
          terminal's scrollback, which is what keeps the live region and
          the composer pinned to the bottom of the screen. */}
      <Static key={generation} items={rows}>
        {(row) => <TranscriptRow key={row.id} row={row} />}
      </Static>

      {/* Live region */}
      {running && (
        <Box>
          <Text color={ACCENT}>{spinner} </Text>
          <Text>{statusLabel ?? "Thinking"}…</Text>
          <Text dimColor>
            {"  "}
            {elapsed}s · esc to interrupt
          </Text>
        </Box>
      )}

      {!running && settling && (
        <Box>
          <Text dimColor>{spinner} winding down the previous run…</Text>
        </Box>
      )}

      {/* Composer — always the last thing on screen */}
      <Box
        borderStyle="round"
        borderColor={composerDisabled ? "gray" : ACCENT}
        paddingX={1}
        marginTop={composerDisabled ? 1 : 0}
      >
        <Text color={composerDisabled ? "gray" : ACCENT} bold>
          {"› "}
        </Text>
        <Box flexGrow={1}>
          <TextInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            placeholder={
              composerDisabled ? "Type to queue a follow-up…" : "Type your task…"
            }
          />
        </Box>
      </Box>

      <Box paddingX={1}>
        {queuedCount > 0 ? (
          <Text dimColor>
            {queuedCount} queued · enter to add another · esc to cancel all
          </Text>
        ) : (
          <Text dimColor>
            enter to send · /help for commands · ctrl+c to exit
          </Text>
        )}
      </Box>
    </Box>
  );
}

render(<App />);