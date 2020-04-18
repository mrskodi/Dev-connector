import { SET_CURRENT_USER } from '../actions/dispatchTypes';

export const registerUser = (userData) => {
  return{
    type: SET_CURRENT_USER,
    payload: userData
  }
}