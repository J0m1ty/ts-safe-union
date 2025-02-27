import { MergedUnion } from "../src/index";

// Define individual state types with a shared discriminator 'state'
type IdleState = {
    state: "idle";
    lastUpdate: Date | null;
};

type ProcessingState = {
    state: "processing";
    lastUpdate: Date;
    progress: number;
    eta: number;
};

// Merge the states
type TaskState = MergedUnion<IdleState, ProcessingState>;

// Example consumer
function updateTask<T extends TaskState>(
    currentState: T,
    newProgress: number
): T extends IdleState ? ProcessingState : TaskState {
    if (newProgress < 0 || newProgress > 100) {
        throw new Error('Progress must be between 0 and 100');
    }
    
    if (currentState.state === "idle") {
        return {
            state: "processing",
            lastUpdate: new Date(),
            progress: newProgress,
            eta: 100 - newProgress,
        } as any;
    }

    return {
        ...currentState,
        progress: newProgress,
        lastUpdate: new Date(),
        eta: 100 - newProgress,
    } as any;
}

// Example usage
const initialState: IdleState = {
    state: "idle",
    lastUpdate: null,
}
const updatedState = updateTask(initialState, 50);
console.log(updatedState.progress);
