import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import {connect, Provider} from 'react-redux'

import {setUserSelected, subscribeAccepted, newCommentAction, requestSubscriptionAction, store} from './store';
import './App.css';

const randomUserURL = 'https://randomuser.me/api?results=10&seed=abc';

const LoginRouter = () => (
  
 /*
    <React.Fragment>
      <Login />
    </React.Fragment>
 */
<Provider store={store}>
  <Router>
    <div>
      <AuthButton />
      <Route path="/" component={Public} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/protected" component={ProtectedPage} />
      <PrivateRoute path="/protected/profile" component={DetailUserList} />
    </div>
  </Router>
  </Provider>
  
);

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const AuthButton = withRouter(
  ({ history }) =>
    fakeAuth.isAuthenticated ? (
      <p>
        Welcome!{" "}
        <button
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <ul>
        <li>
          <Link to="/protected">Login</Link>
        </li>
      </ul> 
    )
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />  
      )
    }
  />
);

const Public = () => 
  fakeAuth.isAuthenticated ? (
    ''
  ) : (
    <h3>Public</h3>
  )

/***********************************************************************************/

/*
const mapStateToProps = state => {
  return {
    userLogged: state.login.userLogged,
    usersList: state.login.usersList 
  }
}

const Protected  = connect(
  mapStateToProps
)(({userLogged, usersList}) =>
  <React.Fragment> 
    <h3>{ userLogged.login.password }Protected</h3>
    <h3>{ usersList[1].login.username }Protected</h3>
  </React.Fragment> 
)*/

const ProtectedPage = (userLogged) => (
  <React.Fragment> 
    <DetailUserLogged />
    <ListUsers />
  </React.Fragment> 
 );

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
    <DetailUserView user={userLogged} />
    <h2>comentarios</h2>
    <ShowUserComments user={userLogged} />
    <ShowUserSubscriptionsData user={userLogged} />
    <ShowUserNewComment user={userLogged} />
  </React.Fragment> 
)

const mapStateToPropsList = state => {
  return {
    userSelected: state.actions.userSelected,
    userLogged: state.login.userLogged
  }
}

const DetailUserList = connect(
  mapStateToPropsList
)(({userSelected, userLogged}) =>
  <React.Fragment>
    <DetailUserView user={userSelected} />
    <DetailUserViewButton user={userSelected} userLogged={userLogged}/>
  </React.Fragment> 
)


const requestSubscription = (user, userLogged) => {
  const userData = localStorage.getItem(user.login.username) === null ? {} : JSON.parse(localStorage.getItem(user.login.username)); 
  const subscriptions = userData.subscriptions === undefined ? new Array : userData.subscriptions;
  const subscription = {username: userLogged.login.username, isaccepted: false};
  subscriptions.push(subscription);
  userData.subscriptions = subscriptions;
  localStorage.setItem(user.login.username, JSON.stringify(userData));
  store.dispatch(requestSubscriptionAction(user.login.username, subscription, user))
}

const DetailUserView = ({user}) =>  
  <div>
    <h3>{user.name.first} {user.name.last}</h3>
    <img src={user.picture.thumbnail} alt={`user.name.first user.name.last`} />
    <p>{user.email}</p>    
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
    return 'Pendiente de aceptar subscripcion';
  }   
}

class ShowUserComments extends React.Component {  
  state = {
    userSelected: this.props.user,
  }
  render() {    
      const userData = localStorage.getItem(this.state.userSelected.login.username); 
      if(userData === null) {
        return null;
      } else {
        const comments = userData===undefined ? {} : JSON.parse(userData).comments;
        return comments.map(comment => <li key={comment}>{comment}</li>);        
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
      return null;
    } else {     
      const subscriptions = userData.subscriptions===undefined ? new Array() : JSON.parse(userData).subscriptions;
      return subscriptions.map(subscription => 
        subscription.isaccepted ? (
          <li key={subscription.username}>{subscription.username}</li>  
        ) : (
          <ul>
            <li>
            <li key={subscription.username}>{subscription.username} <input type="button" onClick={ () => acceptSubscribe(this.state.userSelected, subscription) } value='Aceptar subscripción'/></li>  
            </li>
          </ul>        
        )    
      );
    }   
  }
}

const newComment = (user, comment) => {
  debugger
  const userData = localStorage.getItem(user.login.username) === null ? {} : JSON.parse(localStorage.getItem(user.login.username)); 
  const comments = userData.comments === undefined ? new Array():userData.comments;  
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
      <div>
        <label htmlFor="comment">Comentario</label>
        <input type="textarea" name="comment" maxLength='500' onChange={ this.updateComment} />
        <input type="button" value="Nuevo comentario" onClick={ () => newComment(this.state.userSelected, this.state.comment)} />
      </div>
    )
  }
}


const mapStateToPropsListUsers = state => {
  return {
    usersList: state.login.usersList,
    userLogged: state.login.userLogged
  }
}

const mapDispatchToPropsListUser = (dispatch, userSelected) => ({
  setUserSelected: (userSelected) => dispatch(setUserSelected(userSelected))
})


const userSelected = (user) => {
  store.dispatch(setUserSelected(user))
}

const ListUsers  = connect(
  mapStateToPropsListUsers, mapDispatchToPropsListUser
)(({usersList, userLogged}) =>
  <React.Fragment>
  <ul> Listado de autores
    {usersList.map(user =>
      user.login.username !== userLogged.login.username? (
      <li key={user.name.last}>
        <Link to='/protected/profile' onClick={ () => userSelected(user) }>{user.name.first} {user.name.last}</Link>
        <div>
          <img src={user.picture.thumbnail} alt={`user.name.first user.name.last`} />
          <p>{user.email}</p>
        </div>        
      </li>): (
          ''
      ))
      }
    
</ul>    
  </React.Fragment> 
)

/*********************************************************************************/

class Login extends React.Component {

  state = {
    user: '',
    password: ''
  };

  componentDidMount() {
    fetch(randomUserURL)
    .then((response) => {   
      return response.json();
    })
    .then((response) => {
      this.setState({'users':response.results});
    })
    .catch(error => console.log('Hubo un problema con la petición Fetch:' + error.message));  
  }
  
  login = (users, username, password) => {    
    let userLogged = false;
    users.forEach(function(user) {
      if(user.login.username === username && user.login.password === password) {     
        userLogged = true;  
        store.dispatch({type: 'LOGIN_SUCCESS',  usersList : users, userLogged : user});         
      }
    })
    
    if(userLogged === true){
      fakeAuth.authenticate(() => {
        this.setState({ redirectToReferrer: true});
      });
    } else {
      store.dispatch({type: 'LOGIN_UNSUCESS'});    
      this.setState({ error: 'Usuario o contraseña incorrectos!!'});
    }   
  };

  updateUser = event => this.setState({user: event.target.value});
  updatePassword = event => this.setState({password: event.target.value});

  render() {
    const { from } = { from: { pathname: "/protected" } };
    const { redirectToReferrer } = this.state;
    const { users } = this.state;
    
    if (redirectToReferrer) { 
      return <Redirect to={from} />;
    }

    return (
      <div className="login-wrapper">
        <label htmlFor="user">usuario</label>
        <input type="text" name="user" value={ this.state.user } onChange={this.updateUser} />          
        <label htmlFor="password">contraseña </label>
        <input type="text" name="password" value={ this.state.password } onChange={this.updatePassword} />         
        <input type="button" value="Enviar" onClick={ () => this.login(users, this.state.user, this.state.password) } />
        <p>{ this.state.error }</p>
      </div>
    );
  }
}

export default LoginRouter;