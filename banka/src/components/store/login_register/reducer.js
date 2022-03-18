import { STATE } from "./action";

const __DEFAULT__ = {
    type: STATE,
    layout: "login",
};

export default function login_register_state(state = __DEFAULT__, action) {
    switch (action.type) {
        case STATE:
            return {
                layout: action.layout,
            };
        
        default:
            return state;
            
    }
}
