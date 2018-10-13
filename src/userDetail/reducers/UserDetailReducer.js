import { SUBSCRIBE_ACCEPTED, NEW_COMMENT, REQUEST_SUBSCRIBE } from '../../utils/constants';

const actionsReducer = (state = 'SELECT_USER', action) => {
    switch(action.type) {
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

  export default actionsReducer;