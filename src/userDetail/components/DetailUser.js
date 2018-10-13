import React from "react";
import { connect } from 'react-redux'
import store from '../../store';
import { subscribeAccepted, newCommentAction, requestSubscriptionAction } from '../actions/UserDetailActions'
import '../../App.css';

const mapStateToProps = state => {
  return {
    userLogged: state.login.userLogged,
    subscribeAccepted : state.actions.subscribeAccepted,
    newCommentAction: state.actions.comment
  }
}

const DetailUserLogged  = connect(
  mapStateToProps
)(({userLogged}) =>
  <React.Fragment>    
    <div className="layout-element">
      <div className="detail-element">
      <DetailUserView user={userLogged} />     
      <ShowUserComments user={userLogged} />
      <ShowUserSubscriptionsData user={userLogged} />
      <ShowUserNewComment user={userLogged} />    
      </div>
    </div>
  </React.Fragment> 
)

const mapStateToPropsList = state => {
  return {
    userSelected: state.listUsers.userSelected,
    userLogged: state.login.userLogged,
    subscription: state.actions.subscription
  }
}

const DetailUserList = connect(
  mapStateToPropsList
)(({userSelected, userLogged}) =>
  <React.Fragment>
    <div className="layout-element">
      <div className="detail-element detail-element-selected">
        <DetailUserView user={userSelected} />
        <DetailUserViewButton user={userSelected} userLogged={userLogged}/>
      </div> 
    </div>
  </React.Fragment> 
)


const requestSubscription = (user, userLogged) => {
  const userData = localStorage.getItem(user.login.username) === null ? {} : JSON.parse(localStorage.getItem(user.login.username)); 
  const subscriptions = userData.subscriptions === undefined ? [] : userData.subscriptions;
  const subscription = {username: userLogged.login.username, isaccepted: false};
  subscriptions.push(subscription);
  userData.subscriptions = subscriptions;
  localStorage.setItem(user.login.username, JSON.stringify(userData));
  store.dispatch(requestSubscriptionAction(user.login.username, subscription, user))
}

const DetailUserView = ({user}) =>  
  <div>
    <h2 className="user-name-detail">{user.name.first} {user.name.last}</h2>
    <img className="user-photo-detail" src={user.picture.large} alt={`user.name.first user.name.last`} />
    <p className="user-email-detail">{user.email}</p>    
  </div>

const isSendResquestSubscription = (user, userLogged) => {
  const userData = JSON.parse(localStorage.getItem(user.login.username));
  let stateRequestSubscription = 'NOT_SEND';
  let searchSubscription = null;
  if(userData !== null) {
    if(userData.subscriptions !== undefined) {
      userData.subscriptions.forEach(subscription => {
        if (subscription.username === userLogged.login.username) {
           searchSubscription = subscription;
        }  
      });
    }
  }

  if(searchSubscription!==null) {
    if(searchSubscription.isaccepted) {
      stateRequestSubscription = "IS_ACCEPTED";
    } else {
      stateRequestSubscription = "PENDING";
    } 
  }
  return stateRequestSubscription;
}

const DetailUserViewButton = ({user, userLogged}) => {
  const stateRequest = isSendResquestSubscription(user, userLogged);
  if(stateRequest === 'NOT_SEND') {
    return <input type="button" value="Solicitar subscripción" onClick={ () => requestSubscription(user, userLogged)} />
  } else if (stateRequest === 'IS_ACCEPTED'){
    return <ShowUserComments user={user} />
  } else {
    return <p className="user-detail-warnings">Pendiente de aceptar subscripción</p>;
  }   
}

class ShowUserComments extends React.Component {  
  state = {
    userSelected: this.props.user,
  }
  render() {
    const userData = localStorage.getItem(this.props.user.login.username);
    if(userData === null) {
      return <p className="user-detail-warnings">Sin comentarios</p>;
    } else if(JSON.parse(userData).comments === undefined){
      return <p className="user-detail-warnings">Sin comentarios</p>;
    } else {  
      const comments = userData===undefined ? {} : JSON.parse(userData).comments;
      return <div className="user-detail-wrapper"><p className="user-comments-detail-title">Comentarios:</p>{ comments.map(comment =><li key={comment}>{comment}</li>)}</div>;
    }
  }
}

const acceptSubscribe = (user, acceptedSubscription) => {
  const userData = localStorage.getItem(user.login.username) === undefined ? {} : JSON.parse(localStorage.getItem(user.login.username)); 
  const subscriptions = userData.subscriptions;
  let indexSubscription = subscriptions.findIndex((subscription) => {
    return subscription.username === acceptedSubscription.username;
  });
  acceptedSubscription.isaccepted = true;
  subscriptions.splice(indexSubscription, 1, acceptedSubscription);
  userData.subscriptions = subscriptions;
  localStorage.setItem(user.login.username, JSON.stringify(userData));
  store.dispatch(subscribeAccepted(acceptedSubscription.username))
}

class ShowUserSubscriptionsData extends React.Component {  
  state = {
    userSelected: this.props.user
  }
  render() {
    const userData = localStorage.getItem(this.state.userSelected.login.username);
    if(userData === null) {
      return <p className="user-detail-warnings">Sin suscripciones</p>;
    } else {
      const subscriptions = JSON.parse(userData).subscriptions===undefined ? []: JSON.parse(userData).subscriptions;
      if(subscriptions.length === 0) {
        return <p className="user-detail-warnings">Sin suscripciones</p>;
      } else {          
        return <div className="user-detail-wrapper"><p className="user-comments-detail-title">Suscripciones:</p>{subscriptions.map(subscription => 
          subscription.isaccepted ? (
            <li key={`${subscription.username}${this.props.user.login.password}`}>{subscription.username}</li>
          ) : (                     
            <div key={`${subscription.username}${this.props.user.login.password}`}>
            <p key={`${subscription.username}${this.props.user.login.password}`}>{subscription.username}</p>
            <input type="button" onClick={ () => acceptSubscribe(this.state.userSelected, subscription) } value='Aceptar subscripción'/>
            </div>
          )    
        )}</div>
      }  
    }   
  }
}

const newComment = (user, comment) => {
  const userData = localStorage.getItem(user.login.username) === null ? {} : JSON.parse(localStorage.getItem(user.login.username)); 
  const comments = userData.comments === undefined ? []:userData.comments;  
  comments.push(comment);
  userData.comments = comments;
  localStorage.setItem(user.login.username, JSON.stringify(userData));
  store.dispatch(newCommentAction(user.login.username, comment))
}

class ShowUserNewComment extends React.Component { 

  state = {
    userSelected: this.props.user,
    comment: ''
  }

  updateComment = event => this.setState({comment: event.target.value}); 

  render() {    
    return (
      <div className="user-newComment-wrapper">
        <label htmlFor="comment">Comentario</label>
        
        <textarea className="user-comment-input" name="comment" id="comment-form-message" maxLength="500"
                    placeholder="Escribe un mensaje de no más de 500 caracteres" onChange={ this.updateComment} ></textarea>
        <input type="button" value="Nuevo comentario" onClick={ () => newComment(this.state.userSelected, this.state.comment)} />
      </div>
    )
  }
}

export {
  DetailUserList, DetailUserLogged
}