import { SET_CURRENT_USER } from '../actions/dispatchTypes';

const initialState = {
  isAuthenticated: false,
  user: {}
}
const middleware = applyMiddleware[thunk];

export default function(state=initialState, action){
  switch(action.type){
    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload
      }
    default: return state;
  }
}

