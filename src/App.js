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
  
  <Provider store={store}>
    <Router>
      <div>
        <Header />  
        <Route path="/" component={Public} />
        <div className="detail-user-logged-wrapper">         
          <Route path="/login" component={Login} />
          <PrivateRoute path="/protected" component={ProtectedPage} />
          <PrivateRoute path="/protected/profile" component={DetailUserList} />
        </div>     
        <Footer />
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
        <button className='button-action-header'
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
          }}
        >
          Cerrar sesion
        </button>
      </p>
    ) : (
      <Link className='button-action-header' to="/protected">Iniciar sesion</Link>     
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
    <div className="web-description-wrapper">
      <p>Para comenzar a leer comentarios pulse en el boton <span>Iniciar sesión</span></p>
    </div>
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
    userSelected: state.actions.userSelected,
    userLogged: state.login.userLogged,
    subscription: state.actions.subscription
  }
}

const DetailUserList = connect(
  mapStateToPropsList
)(({userSelected, userLogged}) =>
  <React.Fragment>
    <div className="layout-element">
      <div className="detail-element">
        <DetailUserView user={userSelected} />
        <DetailUserViewButton user={userSelected} userLogged={userLogged}/>
      </div> 
    </div>
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
    return <p className="pending-accept-subscribe">Pendiente de aceptar subscripción</p>;
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
      return <div className="user-comments-detail"><p className="user-comments-detail-title">Comentarios:</p>{ comments.map(comment =><li key="comment">{comment}</li>)}</div>;
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
      <div className="user-newComment-wrapper">
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
    <div className="layout-element">
      <h2 className="list-user-title">Listado de autores</h2>
      <ul> 
        {usersList.map(user =>
          user.login.username !== userLogged.login.username? (
          <li key={user.name.last} className="list-user-element">
            <Link to='/protected/profile' className="list-user-name" onClick={ () => userSelected(user) }>{user.name.first} {user.name.last}</Link>
            <div>
              <img className="list-user-photo" src={user.picture.medium} alt={`user.name.first user.name.last`} />
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
        <input type="password" name="password" value={ this.state.password } onChange={this.updatePassword} />         
        <input type="button" value="Enviar" onClick={ () => this.login(users, this.state.user, this.state.password) } />
        <p className="error">{ this.state.error }</p>
      </div>
    );
  }
}


/*************** COMPONENTES GLOBALES HEADER Y FOOTER ***************/

const Header = () => 
  <header>
    <div className="header-principal">
      <div className="title-container">
        <h1 id="title" className="title">Comentando</h1>
      </div>
      <nav className="menu">
        <div className="menu-wrapper">       
          <div className="link-wrapper">      
            <AuthButton />
          </div>
        </div>
      </nav>
    </div>
  </header>

 const Footer = () => 
  <footer>
    <div className="title-container-footer">
      <p>Comentando</p>
      <p className="copiright"> © 2018 Comentando. All rights reserved.</p>
    </div>
    <nav className="social">
        <i className="fab fa-twitter social-icon"></i>
        <i className="fab fa-facebook-square social-icon"></i>
        <i className="fab fa-google-plus-g social-icon"></i>
    </nav>
  </footer>

export default LoginRouter;