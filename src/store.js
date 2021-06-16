import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import {
    loginReducer,
    userInfoReducer,
    selectOrderDataReducer,
    selectDataReducer
} from "./reducer/reducer";

const reducers = combineReducers({
    loginState: loginReducer,
    userData: userInfoReducer,
    selectOrder: selectOrderDataReducer,
    selectData:selectDataReducer
})


const initialState = {};
const middleware = [thunk];
const store = createStore(
    reducers,
    initialState,
    compose(
        applyMiddleware(...middleware),
        // window .__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
    )
);

export default store
