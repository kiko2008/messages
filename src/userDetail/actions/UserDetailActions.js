import { SUBSCRIBE_ACCEPTED, NEW_COMMENT, REQUEST_SUBSCRIBE } from '../../utils/constants';

const subscribeAccepted = (username) => dispatch => {
  dispatch({type: SUBSCRIBE_ACCEPTED, username}); 
}

const newCommentAction = (username, comment) => dispatch => {
  dispatch({type: NEW_COMMENT, username, comment}); 
}

const requestSubscriptionAction = (username, subscription, userSelected) => dispatch => {
  dispatch({type: REQUEST_SUBSCRIBE  , username, subscription, userSelected}); 
}

export {
    subscribeAccepted, newCommentAction, requestSubscriptionAction
}