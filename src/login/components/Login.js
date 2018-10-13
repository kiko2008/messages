import React from "react";
import { Redirect } from "react-router-dom";
import { authFunction } from '../../utils/utils'
import store from '../../store';
import { login, loginSuccess, loginUnSuccess } from '../actions/LoginActions';

const randomUserURL = 'https://randomuser.me/api?results=10&seed=abc';

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
    store.dispatch(login(users));
    let userLogged = false;
    users.forEach(function(user) {
      if(user.login.username === username && user.login.password === password) {     
        userLogged = true;  
        store.dispatch(loginSuccess(users, user));         
      }
    })
    
    if(userLogged === true){
      authFunction.authenticate(() => {
        this.setState({ redirectToReferrer: true});
      });
    } else {
      debugger
      store.dispatch(loginUnSuccess());    
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

export default Login;  