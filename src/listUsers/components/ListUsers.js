import React from "react";
import { connect } from 'react-redux'
import { Link }from "react-router-dom";

import store from '../../store';
import { setUserSelected } from '../actions/ListUsersAction';
import '../../App.css';

const mapStateToPropsListUsers = state => {
    return {
      usersList: state.login.usersList,
      userLogged: state.login.userLogged
    }
  }
   
  const userSelected = (user) => {
    store.dispatch(setUserSelected(user))
  }
  
  const ListUsers  = connect(
    mapStateToPropsListUsers
  )(({usersList, userLogged}) =>
    <React.Fragment>
      <div className="layout-element">
        <h2 className="list-user-title">Listado de autores</h2>
        <ul> 
          {usersList.map(user =>
            user.login.username !== userLogged.login.username? (
            <li key={`${user.name.first}${user.login.password}`} className="list-user-element">
              <Link to='/protected/profile' className="list-user-name" onClick={ () => userSelected(user) }>{user.name.first} {user.name.last}</Link>
              <div>
                <img className="list-user-photo" src={user.picture.medium} alt={`${user.name.first}${user.name.last}`}/>
                <p className="list-user-email">{user.email}</p>
              </div>        
            </li>): (
                ''
            ))
          }    
        </ul>    
      </div>
    </React.Fragment> 
  )
  
export default ListUsers;