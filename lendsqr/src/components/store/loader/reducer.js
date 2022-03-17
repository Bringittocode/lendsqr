import { STATE } from "./action";

const __DEFAULT__ = {
    type: STATE,
    show: false,
};

export default function loader_state(state = __DEFAULT__, action) {
    switch (action.type) {
        case STATE:
            return {
                show: action.show,
            };
        
        default:
            return state;
            
    }
}
