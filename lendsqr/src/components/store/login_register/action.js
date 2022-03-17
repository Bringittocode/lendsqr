export const STATE = "LOGIN_REGISTER_STATE";

export function login_register_state(type) {
    return {
        type: STATE,
        layout: type
    }
}
