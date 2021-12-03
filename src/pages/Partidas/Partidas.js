import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';
//import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

export default function Partidas() {
  //PARTIDAS
  const [partida, setpartida] = useState([]);
  const [TablaPartida, setTablaPartida] = useState([]);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState({
    id_partida: '',
    fecha: '',
    descripcion_partida: '',
    tipo: '',
  });

  const [cuentas, setcuentas] = useState([]);
  //MODALS
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalInsertarMov, setModalInsertarMov] = useState(false);

  const [busqueda, setbusqueda] = useState('');

  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState({
    id_partida: '',
    codigo: '',
    debe: '',
    haber: '',
    descripcion_movimiento: '',
  });

  const [selectedOption, setSelectedOption] = useState({});
  function fecha_hoy() {
    const hoy = new Date();
    return moment(hoy).format('DD/MM/YYYY');
  }

  const seleccionarPartida = (elemento, caso) => {
    setPartidaSeleccionada(elemento);
    caso === 'Editar'
      ? setModalEditar(true)
      : caso === 'Eliminar'
      ? setModalEliminar(true)
      : setModalInsertarMov(true);
  };
  const [value, setValue] = useState();

  const handleChanger = useCallback((inputValue) => {
    console.log(typeof inputValue.value);
    let codigo = inputValue.value;
    setValue({ codigo: codigo });
    console.log({ codigo: codigo });
  }, []);

  const baseUrl = 'http://localhost:5000';

  //CONSULTAS
  const getCuentas = async () => {
    try {
      await axios.get(`${baseUrl}/cuentas/nombre`).then((respuesta) => {
        setcuentas(respuesta.data);
        console.log(respuesta.data);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const getPartidas = async () => {
    try {
      await axios.get(`${baseUrl}/partidas`).then((respuesta) => {
        setpartida(respuesta.data);
        setTablaPartida(respuesta.data);
        console.log(respuesta.data);
      });
      getCuentas();
    } catch (error) {
      console.log(error.message);
    }
  };

  const postPartidas = async () => {
    // const partida = { id_partida: parseInt(partidaSeleccionada.id_partida) };
    // const returnedTarget = Object.assign(partidaSeleccionada, partida);
    // console.log(returnedTarget);
    try {
      await axios
        .post(`${baseUrl}/partidas`, partidaSeleccionada)
        .then((respuesta) => {
          setpartida(partida.concat(respuesta.data));
          setModalInsertar(false);
          console.log(respuesta.data);
        });
      getPartidas();
    } catch (error) {
      console.log(error.message);
    }
  };
  const postMovimientos = async () => {
    delete movimientoSeleccionado.codigo;

    let movimiento = Object.assign(movimientoSeleccionado, value);
    let saldo = movimiento.debe - movimiento.haber;
    if (movimientoSeleccionado.debe === '') {
      movimientoSeleccionado.debe = 0;
    } else if (movimientoSeleccionado.haber === '') {
      movimientoSeleccionado.haber = 0;
    }
    saldo = Math.abs(saldo);
    movimiento = Object.assign(movimientoSeleccionado, { saldo });
    console.log(movimiento);
    try {
      await axios
        .post(`${baseUrl}/movimientos`, movimiento)
        .then((respuesta) => {
          setModalInsertarMov(false);
        });
      getPartidas();
    } catch (error) {
      console.log(error.message);
    }
  };

  const putPartidas = async () => {
    console.log(partidaSeleccionada);
    try {
      await axios
        .put(
          `${baseUrl}/partidas/${partidaSeleccionada.id_partida}`,
          partidaSeleccionada
        )
        .then((respuesta) => {
          setpartida(partida.concat(respuesta.data));
          setModalEditar(false);
          console.log(respuesta.data);
        });
      getPartidas();
    } catch (error) {
      console.log(error.message);
    }
  };

  const deletePartidas = async () => {
    try {
      await axios
        .delete(
          `${baseUrl}/partidas/${parseInt(partidaSeleccionada.id_partida)} `
        )
        .then((respuesta) => {
          setpartida(
            partida.filter(
              (Cuentas) => Cuentas.id_partida !== partidaSeleccionada.id_partida
            )
          );
          setModalEliminar(false);
          let error = respuesta.data.detail;
          let mensaje = document.getElementById('mensaje');
          if (error !== undefined) {
            mensaje.innerHTML += `<div class="alert alert-success" id='mensaje_c' role="alert">${error}</div>`;

            console.log(document.getElementById('mensaje_c'));
            setTimeout(() => {
              var div = document.getElementById('mensaje_c');
              div.remove(div.firstChild);
              getPartidas();
            }, 4000);

            console.log(error);
          } else {
            console.log(respuesta.data);
            mensaje.innerHTML += `<div class="alert alert-danger" id='mensaje_e' role="alert">${respuesta.data}</div>`;
            console.log(document.getElementById('mensaje_e'));
            setTimeout(() => {
              var div = document.getElementById('mensaje_e');
              div.remove(div.firstChild);
              getPartidas();
            }, 4000);
          }

          getPartidas();
        });
    } catch (error) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartidaSeleccionada((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(partidaSeleccionada);
  };

  const handleChangeMov = (e) => {
    const { name, value } = e.target;
    setMovimientoSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    console.log(movimientoSeleccionado);
  };
  const handleChangeBuscar = (e) => {
    setbusqueda(e.target.value);
    filtrar(e.target.value);
    console.log(e.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = partida.filter((elemento) => {
      if (
        elemento.id_partida
          .toString()
          .toLowerCase()
          .startsWith(terminoBusqueda.toLowerCase()) ||
        elemento.tipo
          .toString()
          .toLowerCase()
          .startsWith(terminoBusqueda.toLowerCase())

        //en vez de startWith se puede usar includes si se quiere una que contenga cierto dato
      ) {
        return elemento;
      }
    });
    setTablaPartida(resultadosBusqueda);
  };

  useEffect(() => {
    async function partidas() {
      await getPartidas();
    }
    partidas();
  }, []);

  const abrirModalInsertar = () => {
    setPartidaSeleccionada(null);
    setModalInsertar(true);
  };

  return (
    <div className='container-fluid' style={{ 'text-align': 'center' }}>
      <div id='todo'>
        <h1>Consultoria e Ingenieria de Obra civil</h1>
        <h2>Partidas</h2>
      </div>
      <br />
      <div className='containerInput' id='todo'>
        <input
          className='form-control inputBuscar'
          value={busqueda}
          placeholder='Buscar Elemento'
          onChange={handleChangeBuscar}
        />
        <br />
        <button className='btn btn-success'>Buscar</button>
      </div>
      <br />
      <div>
        <button className='btn btn-success' onClick={abrirModalInsertar}>
          Crear Partida
        </button>
      </div>
      <br />
      <div id='mensaje'></div>
      <br />
      <br />
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>N° PARTIDA</th>
            <th>TIPO</th>
            <th>DESCRIPCION</th>
            <th>FECHA</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {TablaPartida &&
            TablaPartida.map((elemento) => {
              return (
                <tr>
                  <td>{elemento.id_partida}</td>
                  <td>{elemento.tipo}</td>
                  <td>{elemento.descripcion_partida}</td>
                  <td>{moment(elemento.fecha).format('DD/MM/YYYY')}</td>
                  <td>
                    <button
                      className='btn btn-success'
                      onClick={() => {
                        seleccionarPartida(elemento, 'Movimiento');
                        movimientoSeleccionado.id_partida = elemento.id_partida;
                      }}>
                      + Movi.
                    </button>{' '}
                    <Link
                      className='btn btn-info'
                      to={`/Movimientos/${elemento.id_partida}`}>
                      Ver Movi.
                    </Link>
                    <button
                      className='btn btn-primary'
                      onClick={() => seleccionarPartida(elemento, 'Editar')}>
                      Editar
                    </button>{' '}
                    <button
                      className='btn btn-danger'
                      onClick={() => seleccionarPartida(elemento, 'Eliminar')}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <br />
      <footer class='page-footer font-small blue'>
        <div
          style={{ color: 'black' }}
          class='footer-copyright text-center py-3'>
          <p>Sistema Informatico SIC-Grupo 05-UES-2021</p>
        </div>
      </footer>

      {/* Insertar movimiento */}
      <Modal isOpen={modalInsertarMov}>
        <ModalHeader>
          <div>
            <h3>Crear Movimiento</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <form class='form-group' id='movimiento'>
            <h4 align='left'>Movimientos</h4>
            <label id='id_partida' className='id_partida'>
              N° Partida
            </label>
            <input
              className='form-control'
              readOnly
              name='id_partida'
              id='id_partida'
              value={partidaSeleccionada && partidaSeleccionada.id_partida}
              onChange={handleChangeMov}
            />
            <br />
            <label>Cuenta</label>
            <Select
              className='basic-single'
              classNamePrefix='select'
              isSearchable={true}
              name='codigo'
              options={cuentas}
              defaultValue={selectedOption}
              onChange={handleChanger}
            />

            <br />
            <label for='floatingInputGrid'>Debe</label>
            <input
              disabled={
                movimientoSeleccionado.haber !== '' &&
                movimientoSeleccionado.haber !== 0
              }
              type='text'
              class='form-control col-sm-1'
              id='debe'
              name='debe'
              value={movimientoSeleccionado ? movimientoSeleccionado.debe : ''}
              onChange={handleChangeMov}
            />
            <br />
            <label for='floatingInputGrid'>Haber</label>
            <input
              disabled={
                movimientoSeleccionado.debe !== '' &&
                movimientoSeleccionado.debe !== 0
              }
              type='text'
              class='form-control col-sm-1'
              id='haber'
              name='haber'
              value={movimientoSeleccionado ? movimientoSeleccionado.haber : ''}
              onChange={handleChangeMov}
            />
            <br />
            <label>Descripción</label>
            <input
              type='text'
              class='form-control'
              name='descripcion_movimiento'
              value={
                movimientoSeleccionado
                  ? movimientoSeleccionado.descripcion_movimiento
                  : ''
              }
              onChange={handleChangeMov}
            />
            <br />
          </form>
        </ModalBody>
        <ModalFooter>
          <div class='col-sm-5'>
            <div class='d-grid gap-2 d-md-flex justify-content-md-end'>
              <button
                type='button'
                class='btn btn-success'
                onClick={postMovimientos}>
                Agregar
              </button>
            </div>
          </div>
          <button
            className='btn btn-danger'
            onClick={() => {
              setModalInsertarMov(false);
              getPartidas();
            }}>
            Cancerlar
          </button>
        </ModalFooter>
      </Modal>

      {/* Insertar Partida */}
      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Crear Partida</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <form class='form-group'>
            <label>Fecha</label>
            <input
              className='form-control'
              readOnly
              type='text'
              name='fecha'
              value={
                partidaSeleccionada
                  ? (partidaSeleccionada.fecha = fecha_hoy())
                  : fecha_hoy()
              }
              onChange={handleChange}
            />
            <br />
            <label>Descripcion</label>
            <input
              type='text'
              class='form-control col-sm-1'
              name='descripcion_partida'
              value={
                partidaSeleccionada
                  ? partidaSeleccionada.descripcion_partida
                  : ''
              }
              onChange={handleChange}
            />
            <br />
            <label for='floatingInputGrid'>Tipo</label>
            <input
              type='text'
              class='form-control col-sm-1'
              id='haber'
              name='tipo'
              value={partidaSeleccionada ? partidaSeleccionada.tipo : ''}
              onChange={handleChange}
            />
            <br />
          </form>
        </ModalBody>
        <ModalFooter>
          <div class='col-sm-5'>
            <div class='d-grid gap-2 d-md-flex justify-content-md-end'>
              <button
                type='button'
                class='btn btn-success'
                onClick={postPartidas}>
                Agregar
              </button>
            </div>
          </div>
          <button
            className='btn btn-danger'
            onClick={() => setModalInsertar(false)}>
            Cancerlar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>
          <div>
            <h3>Editar Partida</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <form class='form-group'>
            <label>Fecha</label>
            <input
              className='form-control'
              readOnly
              type='text'
              name='fecha'
              value={partidaSeleccionada && partidaSeleccionada.fecha}
              onChange={handleChange}
            />
            <br />
            <label>Descripcion</label>
            <input
              type='text'
              class='form-control col-sm-1'
              name='descripcion_partida'
              value={
                partidaSeleccionada && partidaSeleccionada.descripcion_partida
              }
              onChange={handleChange}
            />
            <br />
            <label for='floatingInputGrid'>Tipo</label>
            <input
              type='text'
              class='form-control col-sm-1'
              name='tipo'
              value={partidaSeleccionada && partidaSeleccionada.tipo}
              onChange={handleChange}
            />
            <br />
          </form>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={putPartidas}>
            Actualizar
          </button>
          <button
            className='btn btn-danger'
            onClick={() => {
              setModalEditar(false);
              getPartidas();
            }}>
            Cancerlar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          Estás Seguro que deseas eliminar la Partida{' '}
          {partidaSeleccionada && partidaSeleccionada.id_partida}
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={deletePartidas}>
            Sí
          </button>
          <button
            className='btn btn-secondary'
            onClick={() => {
              setModalEliminar(false);
              getPartidas();
            }}>
            No
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
