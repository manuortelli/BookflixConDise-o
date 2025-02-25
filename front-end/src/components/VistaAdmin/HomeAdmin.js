import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import NavegacionAdmin from "./NavegacionAdmin";
import Buscador from "./libros/Buscador";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      token: sessionStorage.getItem("token"),
    };
    this.cerrarSesion = this.cerrarSesion.bind(this);
  }

  cerrarSesion = () => {
    sessionStorage.removeItem("token");
  };

  render() {
    return this.state.token !== "" ? (
      <div>
        <NavegacionAdmin />

        <Buscador></Buscador>
      </div>
    ) : (
      <Redirect to="/login" />
    );
  }
}

/*
import Genero from '../VistaAdmin/Generos/GeneroCRUD';
import Editorial from '../VistaAdmin/Editoriales/EditorialCRUD';
import CargarMetadataLibro from '../VistaAdmin/Libros/CargarMetadataLibro';
import CargarNovedad from '../VistaAdmin/Novedades/CargarNovedad';
import Autores from './Autores/AutoresCRUD';
import Libros from './Libros/Libros';
                <div>
                  
                    
                    <Libros></Libros>
                    <Autores> </Autores>
                    <Editorial> </Editorial>
                    <CargarNovedad> </CargarNovedad>
                    <Genero> </Genero>
                    <CargarMetadataLibro> </CargarMetadataLibro>
                    
                </div>
*/
