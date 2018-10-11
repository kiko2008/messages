import React, { Component } from 'react'
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import {connect, Provider} from 'react-redux'
import thunk from 'redux-thunk'
import {loginReducer} from './store'
import {
  Redirect,
  BrowserRouter,
  Router,
  Route,
  Switch
} from 'react-router-dom'

const randomUserURL = 'https://randomuser.me/api?results=100&seed=abc';

export default class Login extends React.Component {

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
  
  state = {};
  //login = () => this.props.onLogin(this.state.user, this.state.password, this.state.users, this.state);
  login = () => {this.setState({error:null, userSelectednull});this.setState(loginReducer({
    type: 'LOGIN_START',
    payload : {
      username: this.state.user,
      password: this.state.password,
      users: this.state.users 
    }
  }),)};
  updateUser = event => this.setState({user: event.target.value});
  updatePassword = event => this.setState({password: event.target.value});
  render() {
    return (      
      <div className="login-wrapper">
        <label htmlFor="user">usuario</label>
        <input type="text" name="user" value={ this.state.user } onChange={this.updateUser} />          
        <label htmlFor="password">contraseña </label>
        <input type="text" name="password" value={ this.state.password } onChange={this.updatePassword} />         
        <input type="button" value="Enviar" onClick={ this.login } />
        <p>{ this.state.error }</p>
      </div>
    )
  } 
}

class HelloWorld extends React.Component {
  render() {
    return (      
      <div>hola mundo</div>
    )
  }    
}