import { LOGIN_STARTED, LOGIN_SUCCESS, LOGIN_UNSUCCESS } from '../../utils/constants';

const login = (users) => dispatch => {
    dispatch({type: LOGIN_STARTED, users}); 
}

const loginSuccess = (users, user) => dispatch => {
    dispatch({type: LOGIN_SUCCESS,  usersList : users, userLogged : user}); 
}

const loginUnSuccess = () => dispatch => {
    dispatch({type: LOGIN_UNSUCCESS}); 
}

export {
    login, loginSuccess, loginUnSuccess
}
