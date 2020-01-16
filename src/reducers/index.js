import { combineReducers } from "redux";

import errorReducer from "./errorReducer";

export const rootReducer = combineReducers({
    errors: errorReducer
});
