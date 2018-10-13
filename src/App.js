import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";
import { Provider } from 'react-redux'

import store from './store';
import './App.css';

import Header from './generalComponents/Header';
import Footer from './generalComponents/Footer';
import Login from './login/components/Login'
import UserLoggedPage from './generalComponents/UserLoggedPage';
import InfoPage from './generalComponents/InfoPage';
import { DetailUserList } from './userDetail/components/DetailUser';
import { authFunction } from './utils/utils'

const App = () => (  
  <Provider store={store}>
    <Router>
      <div>
        <Header />  
        <Route path="/" component={InfoPage} />
        <div className="detail-user-logged-wrapper">         
          <Route path="/login" component={Login} />
          <PrivateRoute path="/protected" component={UserLoggedPage} />
          <PrivateRoute path="/protected/profile" component={DetailUserList} />
        </div>     
        <Footer />
      </div>
    </Router> 
  </Provider>  
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authFunction.isAuthenticated ? (
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

export default App;