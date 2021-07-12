import {combineReducers} from "redux"
const {postReducer} = require("./reducer")
export default combineReducers({
    posts: postReducer
})