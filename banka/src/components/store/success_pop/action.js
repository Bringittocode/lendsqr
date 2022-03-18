export const STATE = "SUCCESS";

export function success_state(show, message) {
    return {
        type: STATE,
        show: show,
        message: message
    }
}
