
type State = {
    projectId: string | null;
    sandboxId: string | null;
    status: "idle" | "running" | "stopped" | "error";
    agentLoop: "idle" | "running" ;
};

const _state : State = {
  projectId: null,
  sandboxId: null,      
  status: "idle",   
  agentLoop: "idle"  
};


function getProjectId() {
  return _state.projectId;
}

function getSandboxId() {
  return _state.sandboxId;
}

function getStatus() {
  return _state.status;
}

function getAgentLoopStatus() {
  return _state.agentLoop;
}

function getState() {
  return { ..._state };
}

function updateState(partial : Partial<State>) {
  Object.assign(_state, partial);
}

export default {
  getProjectId,
  getSandboxId,
  getStatus,
  getState,
  updateState,
  getAgentLoopStatus,
};