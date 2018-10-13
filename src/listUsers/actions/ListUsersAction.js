import { SELECT_USER } from '../../utils/constants';

const setUserSelected = (userSelected) => dispatch => {
    dispatch({type: SELECT_USER, userSelected}); 
  }

export {
    setUserSelected
}