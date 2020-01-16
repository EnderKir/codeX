import { GET_ERRORS } from "../actions/errorActions";

const initialState = {
  error: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return { ...state, error: action.value };
    default:
      return state;
  }
}
