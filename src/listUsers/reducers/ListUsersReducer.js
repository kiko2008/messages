import { SELECT_USER } from '../../utils/constants';

const listUsersReducer = (state = SELECT_USER, action) => {
    switch(action.type) {
      case SELECT_USER:
        return {state: SELECT_USER, userSelected: action.userSelected};     
      default:
        return state;
    }
  }

export default listUsersReducer;