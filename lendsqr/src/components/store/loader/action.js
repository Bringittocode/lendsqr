export const STATE = "LOADER";

export function loader_state(show) {
    return {
        type: STATE,
        show: show
    }
}
