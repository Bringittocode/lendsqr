import { STATE } from "./action";

const __DEFAULT__ = {
    type: STATE,
    show: false,
    message: "Hurray!!"
};

export default function success_state(state = __DEFAULT__, action) {
    switch (action.type) {
        case STATE:
            return {
                show: action.show,
                message: action.message
            };
        
        default:
            return state;
            
    }
}
