import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import loginReducer from './login/reducers/LoginReducer';
import listUsersReducer from './listUsers/reducers/ListUsersReducer';
import userDetailReducer from './userDetail/reducers/UserDetailReducer';


const rootReducer = combineReducers({
  login: loginReducer,
  actions: userDetailReducer,
  listUsers: listUsersReducer
})

const enhance = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  enhance(applyMiddleware(thunk))
)


export default store