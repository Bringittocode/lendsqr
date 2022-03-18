import { combineReducers } from "redux";
import login_register_state from "./login_register/reducer";
import loader_state from "./loader/reducer";
import error_state from "./error_pop/reducer";
import success_state from "./success_pop/reducer";
import new_transac_state from "./transaction_pop/reducer";


const allStore = combineReducers({
    login_register_state,
    loader_state,
    error_state,
    success_state,
    new_transac_state
});

export default allStore;