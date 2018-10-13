import React from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { authFunction } from '../utils/utils'

const AuthButton = withRouter(({ history }) =>
  authFunction.isAuthenticated ? (
    <p>
        <button className='button-action-header'
        onClick={() => {
          authFunction.signout(() => history.push("/"));
        }}
        >
        Cerrar sesion
        </button>
    </p>
    ) : (
    <Link className='button-action-header' to="/protected">Iniciar sesion</Link>     
    )
);

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

export default Header;