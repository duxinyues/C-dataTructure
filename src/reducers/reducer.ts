import {
    FETCH_POST
} from "../actions/actions";
const initialState = {
    item: []
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_POST:
            return {
                ...state,
                item: action.payload
            }
        default:
            return state
    }
}