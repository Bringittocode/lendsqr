export const STATE = "ERROR";

export function error_state(show, message) {
    return {
        type: STATE,
        show: show,
        message: message
    }
}
