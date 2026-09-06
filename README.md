# EMC Autonomous Coding Agent

A distributed, microservice-based LLM orchestration engine for autonomous software development — combining iterative agentic reasoning, sandboxed execution, closed-loop visual debugging, and long-term memory into a single self-directed coding system.

**Stack:** Node.js · TypeScript · LLMs · Docker · Zod · Playwright · Nginx · BullMQ · PostgreSQL (pgvector) · Drizzle ORM

---

## Overview

EMC is an autonomous coding agent built around a central orchestrator that maintains structured system–user–assistant–tool context across multi-step execution cycles. Rather than a monolithic agent loop, the system decomposes responsibility across independently deployed microservices (memory, embeddings, vision, context compaction) behind a gateway — decoupling the orchestrator's reasoning loop from the implementation details of every capability it relies on.

The result is an agent that can plan, write code, execute it in an isolated sandbox, observe the running application visually, debug based on real console/DOM state, and retain durable memory of past work — all while remaining fault-tolerant and independently scalable at each layer.

---

## Architecture

### LLM Orchestration Engine
A central agent manages structured conversational context (system / user / assistant / tool) across execution cycles, handling tool selection, invocation, and result interpretation through a custom tool-call execution layer. Memory, embedding, vision, and context-compaction workloads are delegated to independently deployed microservices behind a gateway, each owning its own resolution and execution logic. This fully decouples the orchestrator from internal service implementations, enabling independent scaling, deployment, and fault isolation per service.

### Dynamic Tool Orchestration Framework
- Runtime tool registration
- JSON argument parsing from raw LLM output
- Backend **Zod** schema validation of all model-generated parameters
- Server-side application-context injection (the model never supplies trusted context directly)
- Standardized response formatting and structured error propagation

All execution is **application-controlled**: model-generated parameters are validated and enriched with server-side project context *before* any shell, filesystem, web, or Docker operation is allowed to run — preventing hallucinated or injected parameters from directly triggering privileged operations.

### Tool Ecosystem (25+ tools)
Spans shell execution, web/URI search, project management, calculator/time utilities, and Docker sandbox lifecycle operations. Tools follow a strict inter-service contract:
- **Local tools** execute in-process.
- **Delegated tools** hand off to their owning microservice via the gateway.

The orchestrating LLM only ever sees a typed contract and a result — it has no visibility into tool implementation, execution location, or failure handling.

### Docker Sandbox & Closed-Loop Visual Debugging
- Isolated, per-project Docker sandboxes with image discovery/building and full container lifecycle management
- Persistent project-to-container state with recovery after failure or disconnect
- Execution tracing throughout the sandbox lifecycle
- Applications are exposed behind an **Nginx** reverse proxy and independently observed in real time by a **Browser/Vision microservice** running a **Playwright** automation loop, capturing DOM state, screenshots, and console/runtime errors to feed back into the agent's debugging cycle

### Fault-Tolerant Async Job Pipeline
Built on **BullMQ**, with failure-classified retry logic — transient vs. permanent errors are routed to distinct recovery paths rather than blindly retrying until success — ensuring the orchestrator and end user always receive an explicit success/failure response instead of silent breakage.

**Validation:** stress-tested across 2,000+ events and 20+ compaction cycles, achieving **99.95% job-processing reliability**, with the single anomaly root-caused to a transient upstream embedding-service fault and confirmed non-reproducible.

### Memory Microservice
A dedicated memory system built on **pgvector**, using top-10 dense retrieval over 768-dimensional embeddings, spanning semantic, episodic, and behavioral memory types.

A confidence-weighted resolution state machine governs how new information is integrated:

```
CREATE → UPDATE → REINFORCE → DECAY → DELETE → NO_OP
```

- Consolidated 2,000+ raw events into ~850 durable active memories
- Validated across **115 end-to-end test cases**, covering new-context creation, content merge, reinforcement, confidence updates, low-confidence deletion, and confidence-weighted contradiction merge/override
- Memory identifiers are isolated from the LLM context window for security and cost control

### Context Compaction Protocol
A boundary-safe compaction mechanism that keeps long-running agent sessions within context limits without breaking execution state:
- Token/turn-threshold triggers compute a target cut point
- Backward scanning guarantees tool-call/response pairs are never split mid-exchange
- A verbatim recent-history tail is always preserved

**Result:** ~65% context reduction (~99K → ~34K tokens) with **100% task-state recoverability** across every compaction pass tested.

---

## Key Engineering Principles

- **Service isolation over monolithic control** — every non-core capability (memory, vision, embeddings, compaction) is its own service with its own execution and failure semantics.
- **Application-controlled execution** — the LLM proposes; the backend validates, injects context, and authorizes. No model output reaches a privileged operation unchecked.
- **Explicit failure over silent breakage** — every async job resolves to a classified, explicit outcome.
- **Typed contracts, not implementation leakage** — the orchestrator interacts with tools purely through schemas and results, never internals.
- **Closed-loop debugging** — the agent doesn't just write code, it watches the code run (DOM, screenshots, console/runtime errors) and reacts.

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Orchestration & Services | Node.js, TypeScript |
| Reasoning | LLMs (tool-calling agent loop) |
| Validation | Zod |
| Sandboxing | Docker |
| Reverse Proxy | Nginx |
| Browser Automation / Vision | Playwright |
| Async Job Processing | BullMQ |
| Vector Storage / Memory | PostgreSQL + pgvector |
| ORM | Drizzle ORM |

---

## Project Structure

The repo is organized as three independently run microservices plus documentation:

```
.
├── aiAgent/        # Central LLM orchestration engine (main agent)
├── helperAgent/    # Tool/helper microservice
├── memoryAgent/    # Memory microservice (pgvector, embeddings, retrieval)
└── README.md
```

Each folder is its own Node.js project with its own dependencies, build step, and `.env` file — they are not managed as a single monorepo install, so each must be set up individually.

---

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Install dependencies for each microservice

Dependencies are **not shared** — install separately inside each folder:

```bash
cd aiAgent && npm install
cd ../helperAgent && npm install
cd ../memoryAgent && npm install
```

### 3. Create a `.env` file in each microservice

Each of `aiAgent/`, `helperAgent/`, and `memoryAgent/` needs its own `.env` file before building or running.

**`memoryAgent/.env`**
```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/emc
REDIS_HOST=localhost
REDIS_PORT=6379
model_API_KEY=
```

> Add the equivalent `.env` files for `aiAgent/` and `helperAgent/` with whatever environment variables each service requires (e.g. API keys, ports, service URLs).

### 4. Build each microservice

From inside each folder:

```bash
npm run build
```

### 5. Run each microservice

**Memory Agent** — runs in dev mode:
```bash
cd memoryAgent
npm run dev
```
Runs on **http://localhost:30001**

**Helper Agent** — runs in dev mode:
```bash
cd helperAgent
npm run dev
```
Runs on **http://localhost:3000**

**AI Agent** — after building, run the compiled output directly:
```bash
cd aiAgent
node ./dist/app.js
```

> Start the **Memory Agent** and **Helper Agent** first, then start the **AI Agent** last, since it orchestrates and depends on the other two services being available.

---

## Developer and maintener

Indresh Vikram Bipul
