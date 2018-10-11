import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
//import {createAction /*createActionCreator */, handleAction, createActions, handleActions, combineActions} from 'redux-actions'
import {createAction} from 'redux-actions'
import {createSelector} from 'reselect'

// Tipos de acciones para el login
const LOGIN_STARTED = 'LOGIN_STARTED';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_UNSUCCESS = 'LOGIN_UNSUCCESS';

const SELECT_USER = 'SELECT_USER';
const SUBSCRIBE_ACCEPTED = 'SUBSCRIBE_ACCEPTED';
const NEW_COMMENT = 'NEW_COMMENT';
const REQUEST_SUBSCRIBE = 'REQUEST_SUBSCRIBE';


// actions for login REFACTORIZAR Y REALIZAR LAS LLAMADAS A TRAVES DE ACCCIONES NO CON LAS ACCIONES DIRECTMENTE EN DISPACHER
const login = (username, password, users, state) => dispatch => {
  dispatch({type: LOGIN_STARTED, username, password, users}); 
}

const setUserSelected = (userSelected) => dispatch => {
  dispatch({type: SELECT_USER, userSelected}); 
}

const subscribeAccepted = (username) => dispatch => {
  dispatch({type: SUBSCRIBE_ACCEPTED, username}); 
}

const newCommentAction = (username, comment) => dispatch => {
  dispatch({type: NEW_COMMENT, username, comment}); 
}

const requestSubscriptionAction = (username, subscription, userSelected) => dispatch => {
  dispatch({type: REQUEST_SUBSCRIBE  , username, subscription, userSelected}); 
}

const loginUser = (username, password, users) => ({
  type: LOGIN_STARTED,
  payload : {
    username: username,
    password: password,
    users: users
  }
})

/*const loginUserEnd = () => ({
  type: LOGIN_END 
})*/

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

const actionsReducer = (state = SELECT_USER, action) => {
  switch(action.type) {
    case SELECT_USER:
      return {state: SELECT_USER, userSelected: action.userSelected};
    case SUBSCRIBE_ACCEPTED:
      return {state: SUBSCRIBE_ACCEPTED, subscribeAccepted: action.username};
    case NEW_COMMENT:
      return {state: NEW_COMMENT, username: action.username, comment: action.comment};
    case REQUEST_SUBSCRIBE:
      return {
              state: REQUEST_SUBSCRIBE, 
              username: action.username, 
              subscription: action.subscription,
              userSelected: action.userSelected
             };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  login: loginReducer,
  actions: actionsReducer
})

const actionLoginError = state => state.login.error;
const actionLoginErrorSelector = createSelector(
  actionLoginError,
  ( error ) => ({ error })
)

const enhance = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  enhance(applyMiddleware(thunk))
)


export default store

export {
  store, loginUser, login, actionLoginErrorSelector, loginReducer, setUserSelected, subscribeAccepted, newCommentAction, requestSubscriptionAction
}