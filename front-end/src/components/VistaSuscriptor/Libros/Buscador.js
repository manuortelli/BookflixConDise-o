import React, { Component } from "react";
import axios from "../../../../node_modules/axios";
import Slider from "react-slick";
import { Link } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const portada = "http://localhost:4000/uploads/";
const autores = "http://localhost:4000/api/autores/";
const generos = "http://localhost:4000/api/generos/";
const editoriales = "http://localhost:4000/api/editoriales/";
const libros = "http://localhost:4000/api/libros/";

export default class Buscador extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: sessionStorage.getItem("token"),

      buscador: "",
      autor: "",
      genero: "",
      editorial: "",

      libros: [],
      autores: [],
      generos: [],
      editoriales: [],

      librosConFiltro: [],
      LibrosCarrousel: [],
      borrar: false,
    };
    this.loPuedoAgregar = this.loPuedoAgregar.bind(this);
  }
  setAutores(res) {
    this.setState({
      autores: res,
    });
  }
  setGeneros(res) {
    this.setState({
      generos: res,
    });
  }

  setEditoriales(res) {
    this.setState({
      editoriales: res,
    });
  }

  filtrarFechas = (libros) => {
    var res = [];
    const hoyEntera = new Date();
    libros.map((lib) => {
      if (lib.lanzamiento != null) {
        const hoy = JSON.stringify(new Date().getDate());
        const mes = JSON.stringify(new Date().getMonth() + 1);
        const año = JSON.stringify(new Date().getFullYear());

        const lanMes = JSON.stringify(new Date(lib.lanzamiento).getMonth() + 1);

        const lanHoy = JSON.stringify(new Date(lib.lanzamiento).getDate());

        const lanAño = JSON.stringify(new Date(lib.lanzamiento).getFullYear());
        const lanzaEntera = new Date(lib.lanzamiento);
        if (
          (lanHoy == hoy) & (lanMes == mes) & (lanAño == año) ||
          lanzaEntera < hoyEntera
        ) {
          if (lib.expiracion != null) {
            var ven = new Date(lib.expiracion);
            const venciMes = JSON.stringify(
              new Date(lib.expiracion).getMonth() + 1
            );

            const venciHoy = JSON.stringify(new Date(lib.expiracion).getDate());

            const venciAño = JSON.stringify(
              new Date(lib.expiracion).getFullYear()
            );
            const venciEntera = new Date(lib.expiracion);

            if (
              (venciHoy == hoy) & (venciMes == mes) & (venciAño == año) ||
              venciEntera > hoyEntera
            ) {
              res.push(lib);
            }
          } else {
            res.push(lib);
          }
        }
      }
    });
    return res;
  };

  setLibros(res) {
    console.log("lista de libros");
    var re = this.filtrarFechas(res);

    console.log(re);
    this.setState({
      libros: re,
      librosConFiltro: re,
    });
    this.setLibrosConFiltro(re);
  }
  setLibrosConFiltro(res) {
    var num = 2;
    var aux = [];
    var aux2 = [];

    res.map((libro) => {
      if (aux.length < num) {
        aux.push(libro);
      } else {
        aux.push(libro);
        aux2.unshift(aux);
        aux = [];
      }
    });
    if (aux != []) {
      aux2.unshift(aux);
    }
    this.setState({
      LibrosCarrousel: aux2,
    });
  }

  getData = async () => {
    await axios
      .get(libros, {
        headers: { xaccess: this.state.token },
      })
      .then((res) => {
        this.setLibros(res.data);
      })
      .catch();

    await axios
      .get(autores, {
        headers: { xaccess: this.state.token },
      })
      .then((res) => {
        this.setAutores(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .get(generos, {
        headers: { xaccess: this.state.token },
      })
      .then((res) => {
        this.setGeneros(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .get(editoriales, {
        headers: { xaccess: this.state.token },
      })
      .then((res) => {
        this.setEditoriales(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async componentDidMount() {
    this.getData();
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  loPuedoAgregar = (libro) => {
    var puedo = true;

    if (this.state.buscador != "") {
      var resultado = libro.titulo
        .toLowerCase()
        .indexOf(this.state.buscador.toLowerCase());

      if (resultado != -1) {
        puedo = true;
      } else {
        return false;
      }
    }

    if (this.state.autor != "") {
      if (this.state.autor == libro.autor) {
        puedo = true;
      } else {
        return false;
      }
    }

    if (this.state.genero != "") {
      if (this.state.genero == libro.genero) {
        puedo = true;
      } else {
        return false;
      }
    }
    if (this.state.editorial != "") {
      if (this.state.editorial == libro.editorial) {
        puedo = true;
      } else {
        return false;
      }
    }
    return puedo;
  };

  onSubmit = (e) => {
    e.preventDefault();

    var lib = [];

    this.state.libros.map((libro) => {
      if (this.loPuedoAgregar(libro)) {
        lib.push(libro);
      }
    });

    this.setState({
      librosConFiltro: lib,
    });
    if (lib.length === 0) {
      alert("No existen libros que coincidan con los filtros puestos");
    }

    this.setLibrosConFiltro(lib);
  };

  limpiar = (e) => {
    var copia = this.state.autores;

    this.setState({
      librosConFiltro: this.state.libros,
      autor: "",
      buscador: "",
      editorial: "",
      genero: "",

      borrar: true,
    });

    this.render();
  };

  render() {
    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      className: "slides",

      
    };

    return (
      <div>
        <div className="col-md-8 offset-md-2">
          <form onSubmit={this.onSubmit}>
            <div className="itemBuscador">
              <input
                className="form-control"
                id="exampleFormControlInput1"
                name="buscador"
                onChange={this.onInputChange}
                value={this.state.buscador}
                placeholder="Buscar"
              ></input>
            </div>

            <div className="itemBuscador">
              <select
                className="form-control"
                onChange={this.onInputChange}
                id="exampleFormControlSelect1"
                name="autor"
                value={this.state.autor}
              >
                <option value="" selected>
                  Autor/a
                </option>
                {this.state.autores.map((autor) => (
                  <option key={autor._id} value={autor._id}>
                    {autor.nombre} {autor.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="itemBuscador">
              <select
                className="form-control"
                value={this.state.genero}
                onChange={this.onInputChange}
                id="exampleFormControlSelect1"
                name="genero"
              >
                <option value="">Género</option>
                {this.state.generos.map((ge) => (
                  <option key={ge._id} value={ge._id}>
                    {ge.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="itemBuscador">
              <select
                className="form-control"
                onChange={this.onInputChange}
                id="exampleFormControlSelect1"
                name="editorial"
                value={this.state.editorial}
              >
                <option value="">Editorial</option>
                {this.state.editoriales.map((ed) => (
                  <option key={ed.id} value={ed._id}>
                    {ed.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-light itemBoton  ">
              <svg
                class="bi bi-search"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"
                />
                <path
                  fill-rule="evenodd"
                  d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"
                />
              </svg>
            </button>
            <button onClick={this.limpiar} className="btn btn-light itemBoton ">
              <svg
                class="bi bi-backspace"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6.603 2h7.08a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7.08a1 1 0 0 1-.76-.35L1 8l4.844-5.65A1 1 0 0 1 6.603 2zm7.08-1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08z"
                />
                <path
                  fill-rule="evenodd"
                  d="M5.83 5.146a.5.5 0 0 0 0 .708l5 5a.5.5 0 0 0 .707-.708l-5-5a.5.5 0 0 0-.708 0z"
                />
                <path
                  fill-rule="evenodd"
                  d="M11.537 5.146a.5.5 0 0 1 0 .708l-5 5a.5.5 0 0 1-.708-.708l5-5a.5.5 0 0 1 .707 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        <div className="carrusel">
          <Slider {...settings}>
            {this.state.librosConFiltro.map((libro) => (
              <div className="container-VerLibro">
                <div className="box">
                  <Link
                    className="imgBx"
                    to={"/suscriptor/libros/" + libro._id}
                  >
                    <img src={portada + libro.portada} />
                  </Link>
                  <span className="content">
                    <span>
                      <br></br>
                      <h2 className="titulo"> {libro.titulo} </h2>
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  }
}
