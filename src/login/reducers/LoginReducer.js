import {LOGIN_STARTED, LOGIN_SUCCESS, LOGIN_UNSUCCESS} from '../../utils/constants';

const loginReducer = (state = LOGIN_STARTED, action) => {
    switch(action.type) {
      case LOGIN_STARTED:
        return {state: LOGIN_STARTED};
      case LOGIN_SUCCESS:
        return {state: LOGIN_SUCCESS, usersList: action.usersList, userLogged: action.userLogged};
      case LOGIN_UNSUCCESS:
        return {state: LOGIN_UNSUCCESS};
      default:
        return state;
    }
  }  

export default loginReducer;