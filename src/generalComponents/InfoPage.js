import React from "react";
import { authFunction } from '../utils/utils'

const InfoPage = () => 
  authFunction.isAuthenticated ? (
    ''
  ) : (
    <div className="web-description-wrapper">
      <p>Para comenzar a leer comentarios pulse en el boton <span>Iniciar sesión</span></p>
    </div>
  )

export default InfoPage;  