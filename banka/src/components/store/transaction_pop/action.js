export const STATE = "NEW_TRANSAC";

export function new_transac_state(show) {
    return {
        type: STATE,
        show: show,
    }
}
