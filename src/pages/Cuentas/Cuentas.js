import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import './Cuentas.scss';

export default function Cuentas() {
  const [Cuentas, setCuentas] = useState([]);
  const [TablaCuentas, setTablaCuentas] = useState([]);
  const [rubros, setRubros] = useState([]);

  // MODALS
  const [modalEditor, setmodalEditor] = useState(false);
  const [modalEliminar, setmodalEliminar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);

  const [busqueda, setbusqueda] = useState('');
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState({
    codigo: '',
    nombre: '',
    id_rubro: '',
    saldo_cuenta: '',
    tipo_cuenta: '',
    descripcion: '',
    movimiento: '',
  });

  const baseUrl = 'http://localhost:5000';

  //listas constantes
  const saldoCuenta = [
    { key: 'Deudor', text: 'Deudor', value: 'Deudor' },
    { key: 'Acreedor', text: 'Acreedor', value: 'Acreedor' },
  ];
  const tipoCuenta = [
    { key: 'Detalle', text: 'Detalle', value: 'Detalle' },
    { key: 'Resultado', text: 'Resultado', value: 'Resultado' },
  ];
  const movimiento = [
    { key: 'Si', text: 'Si', value: 'Si' },
    { key: 'No', text: 'No', value: 'No' },
  ];

  //Funcion para agregar los valores de cuenta padre
  function validar(codigohijo) {
    let nivel, nivel_padre, codigo_padre;
    let codigo = codigohijo.toString();
    let longitud = codigo.length;
    if (longitud === 1) {
      nivel = 0;
      codigo_padre = -codigo;
      nivel_padre = -1;
    } else if (longitud === 2) {
      nivel = 1;
      codigo_padre = codigo.substring(0, 1);
      nivel_padre = 0;
    } else if (longitud === 4) {
      nivel = 2;
      codigo_padre = codigo.substring(0, 2);
      nivel_padre = 1;
    } else if (longitud === 6) {
      nivel = 3;
      codigo_padre = codigo.substring(0, 4);
      nivel_padre = 2;
    } else if (longitud === 8) {
      nivel = 4;
      codigo_padre = codigo.substring(0, 6);
      nivel_padre = 3;
    } else if (longitud === 10) {
      nivel = 5;
      codigo_padre = codigo.substring(0, 8);
      nivel_padre = 4;
    }
    codigo_padre = parseInt(codigo_padre);
    return { nivel, codigo_padre, nivel_padre };
  }

  //SENTENCIAS
  const getRubros = async () => {
    try {
      await axios.get(`${baseUrl}/rubros`).then((respuesta) => {
        setRubros(respuesta.data);
        console.log(respuesta.data);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  //CEUNTA
  const getCuentas = async () => {
    try {
      await axios.get(`${baseUrl}/cuentas`).then((respuesta) => {
        setCuentas(respuesta.data);
        setTablaCuentas(respuesta.data);
      });
      getRubros();
    } catch (error) {
      console.log(error.message);
    }
  };
  const postCuentas = async () => {
    let retorno = validar(cuentaSeleccionada.codigo);
    console.log(retorno);
    cuentaSeleccionada.codigo = parseInt(cuentaSeleccionada.codigo);
    cuentaSeleccionada.id_rubro = parseInt(cuentaSeleccionada.id_rubro);

    const returnedTarget = Object.assign(cuentaSeleccionada, retorno);
    console.log(returnedTarget);
    try {
      await axios
        .post(`${baseUrl}/cuentas`, returnedTarget)
        .then((respuesta) => {
          setTablaCuentas(TablaCuentas.concat(respuesta.data));
          setModalInsertar(false);
          console.log(respuesta.data);
        });
      getCuentas();
    } catch (error) {
      console.log(error.message);
    }
  };
  const putCuentas = async () => {
    let retorno = validar(cuentaSeleccionada.codigo);
    const returnedTarget = Object.assign(cuentaSeleccionada, retorno);
    console.log(returnedTarget);
    try {
      await axios
        .put(
          `${baseUrl}/cuentas/${cuentaSeleccionada.id_cuenta}`,
          returnedTarget
        )
        .then((respuesta) => {
          setTablaCuentas(TablaCuentas.concat(respuesta.data));
          setmodalEditor(false);
          console.log(respuesta.data);
        });
      getCuentas();
    } catch (error) {
      console.log(error.message);
    }
  };
  const deleteCuentas = async () => {
    try {
      await axios
        .delete(`${baseUrl}/cuentas/${cuentaSeleccionada.id_cuenta}`)
        .then((respuesta) => {
          setTablaCuentas(
            TablaCuentas.filter(
              (Cuentas) => Cuentas.id_cuenta !== cuentaSeleccionada.id_cuenta
            )
          );
          setmodalEliminar(false);
          let error = respuesta.data.detail;
          let mensaje = document.getElementById('mensaje');
          if (error !== undefined) {
            mensaje.innerHTML += `<div class="alert alert-success" id='mensaje_c' role="alert">${error}</div>`;

            console.log(document.getElementById('mensaje_c'));
            setTimeout(() => {
              var div = document.getElementById('mensaje_c');
              div.remove(div.firstChild);
              getCuentas();
            }, 4000);

            console.log(error);
          } else {
            console.log(respuesta.data);
            mensaje.innerHTML += `<div class="alert alert-danger" id='mensaje_e' role="alert">${respuesta.data}</div>`;
            console.log(document.getElementById('mensaje_e'));
            setTimeout(() => {
              var div = document.getElementById('mensaje_e');
              div.remove(div.firstChild);
              getCuentas();
            }, 4000);
          }
        });
    } catch (error) {}
  };

  useEffect(() => {
    async function cuentas() {
      await getCuentas();
    }
    cuentas();
  }, []);

  //PROCESOS

  const seleccionarCuenta = (elemento, caso) => {
    setCuentaSeleccionada(elemento);
    caso === 'Editar' ? setmodalEditor(true) : setmodalEliminar(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCuentaSeleccionada((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(cuentaSeleccionada);
  };

  //BUSQUEDA
  const handleChangeBuscar = (e) => {
    setbusqueda(e.target.value);
    filtrar(e.target.value);
    console.log(e.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = Cuentas.filter((elemento) => {
      if (
        elemento.nombre
          .toString()
          .toLowerCase()
          .startsWith(terminoBusqueda.toLowerCase()) ||
        elemento.codigo
          .toString()
          .toLowerCase()
          .startsWith(terminoBusqueda.toLowerCase())

        //en vez de startWith se puede usar includes si se quiere una que contenga cierto dato
      ) {
        return elemento;
      }
    });
    setTablaCuentas(resultadosBusqueda);
  };

  const abrirModalInsertar = () => {
    setCuentaSeleccionada(null);
    setModalInsertar(true);
  };

  return (
    <>
      {/* BUSQUEDA DE CUENTAS */}
      <div className='container-fluid' style={{ 'text-align': 'center' }}>
        <h1>Consultoria e Ingenieria de Obra civil</h1>
        <h2>Cuentas</h2>
        <div>
          <input
            className='form-control'
            value={busqueda}
            placeholder='Buscar Elemento'
            onChange={handleChangeBuscar}
          />
          <br />
          <button className='btn btn-success'>Buscar</button>
        </div>
      </div>

      {/* INICIO DE LA APLICACION CUENTAS */}
      <div className='container-fluid' style={{ 'text-align': 'center' }}>
        <br />
        <button
          className='btn btn-success'
          style={{ align: 'center' }}
          onClick={() => {
            abrirModalInsertar();
          }}>
          Crear Cuenta
        </button>
        <br />
        <br />
        <div id='mensaje'></div>
        <br />
        {/* TABLA DE DATOS */}
        <div className='table-responsive'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>CODIGO</th>
                <th>NOMBRE</th>
                <th>RUBRO</th>
                <th>SALDO CUENTA</th>
                <th>TIPO CUENTA</th>
                <th>DESCRIPCION</th>
                <th>MOVIMIENTO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {TablaCuentas &&
                TablaCuentas.map((elemento) => {
                  return (
                    <tr>
                      <td>{elemento.codigo}</td>
                      <td>{elemento.nombre}</td>
                      <td>{elemento.rb_nombre}</td>
                      <td>{elemento.saldo_cuenta}</td>
                      <td>{elemento.tipo_cuenta}</td>
                      <td>{elemento.descripcion}</td>
                      <td>{elemento.movimiento}</td>
                      <td>
                        <button
                          className='btn btn-primary'
                          onClick={() => seleccionarCuenta(elemento, 'Editar')}>
                          Editar
                        </button>{' '}
                        <button
                          className='btn btn-danger'
                          onClick={() =>
                            seleccionarCuenta(elemento, 'Eliminar')
                          }>
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
        </div>
        {/* MODAL DE EDITAR */}
        <Modal isOpen={modalEditor}>
          <ModalHeader>
            <div>
              <h3>Editar Cuenta</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className='form-group'>
              <label>Codigo</label>
              <input
                className='form-control'
                type='text'
                name='codigo'
                value={cuentaSeleccionada && cuentaSeleccionada.codigo}
                onChange={handleChange}
                required
              />
              <br />
              <label>Nombre</label>
              <input
                className='form-control'
                type='text'
                name='nombre'
                value={cuentaSeleccionada && cuentaSeleccionada.nombre}
                onChange={handleChange}
                required
              />
              <br />
              <label>Rubro</label>
              <select
                name='id_rubro'
                onChange={handleChange}
                className='form-control'
                value={cuentaSeleccionada && cuentaSeleccionada.id_rubro}>
                <option selected>Seleccione Rubro</option>
                {rubros.map((rubro) => {
                  return (
                    <option name='id_rubro' value={rubro.id_rubro}>
                      {rubro.rb_nombre}
                    </option>
                  );
                })}
              </select>
              <br />
              <label style={{ color: 'black' }}>Saldo de Cuenta</label>
              <select
                name='saldo_cuenta'
                onChange={handleChange}
                className='form-control'
                value={cuentaSeleccionada && cuentaSeleccionada.saldo_cuenta}>
                <option selected>Seleccione Saldo de Cuenta</option>
                {saldoCuenta.map((saldo) => {
                  return (
                    <option selected name='saldo_cuenta' value={saldo.key}>
                      {saldo.text}
                    </option>
                  );
                })}
              </select>
              <br />
              <label style={{ color: 'black' }}>Tipo de Cuenta</label>
              <select
                name='tipo_cuenta'
                onChange={handleChange}
                className='form-control'
                value={cuentaSeleccionada && cuentaSeleccionada.tipo_cuenta}>
                <option selected>Seleccione Tipo de Cuenta</option>
                {tipoCuenta.map((tipo) => {
                  return (
                    <option selected name='tipo_cuenta' value={tipo.key}>
                      {tipo.text}
                    </option>
                  );
                })}
              </select>
              <br />
              <label>Descripcion</label>
              <input
                className='form-control'
                type='text'
                name='descripcion'
                value={cuentaSeleccionada && cuentaSeleccionada.descripcion}
                onChange={handleChange}
                required
              />
              <br />
              <label style={{ color: 'black' }}>Movimiento</label>
              <select
                name='movimiento'
                onChange={handleChange}
                className='form-control'
                value={cuentaSeleccionada && cuentaSeleccionada.movimiento}>
                <option>Seleccionar si tiene Movimiento</option>
                {movimiento.map((tipo) => {
                  return (
                    <option selected name='movimiento' value={tipo.key}>
                      {tipo.text}
                    </option>
                  );
                })}
              </select>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-primary' onClick={putCuentas}>
              Actualizar
            </button>
            <button
              className='btn btn-danger'
              onClick={() => setmodalEditor(false)}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
        {/* MODAL DE ELIMINAR */}
        <Modal isOpen={modalEliminar}>
          <ModalBody>
            <p>
              Estás Seguro que deseas eliminar la cuenta:{' '}
              <b>{cuentaSeleccionada && cuentaSeleccionada.nombre}</b>
            </p>
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-danger' onClick={deleteCuentas}>
              Sí
            </button>
            <button
              className='btn btn-secondary'
              onClick={() => setmodalEliminar(false)}>
              No
            </button>
          </ModalFooter>
        </Modal>

        {/* MODAL DE INSERTAR */}
        <Modal isOpen={modalInsertar}>
          <ModalHeader>
            <div>
              <h3>Insertar Cuenta</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className='form-group'>
              <label>Codigo</label>
              <input
                className='form-control'
                type='text'
                name='codigo'
                value={cuentaSeleccionada ? cuentaSeleccionada.codigo : ''}
                onChange={handleChange}
                required
              />
              <br />
              <label>Nombre</label>
              <input
                className='form-control'
                type='text'
                name='nombre'
                value={cuentaSeleccionada ? cuentaSeleccionada.nombre : ''}
                onChange={handleChange}
                required
              />
              <br />
              <label>Rubro</label>
              <select
                name='id_rubro'
                onChange={handleChange}
                className='form-control'>
                <option>Seleccionar Rubro</option>
                {rubros.map((rubro) => {
                  return (
                    <option name='id_rubro' value={rubro.id_rubro}>
                      {rubro.rb_nombre}
                    </option>
                  );
                })}
              </select>
              <br />
              <label style={{ color: 'black' }}>Saldo de Cuenta</label>
              <select
                name='saldo_cuenta'
                onChange={handleChange}
                className='form-control'>
                <option>Seleccionar Saldo Cuenta</option>
                {saldoCuenta.map((saldo) => {
                  return (
                    <option name='saldo_cuenta' value={saldo.value}>
                      {saldo.text}
                    </option>
                  );
                })}
              </select>
              <br />
              <label style={{ color: 'black' }}>Tipo de Cuenta</label>
              <select
                name='tipo_cuenta'
                onChange={handleChange}
                className='form-control'>
                <option>Seleccionar Tipo de Cuenta</option>
                {tipoCuenta.map((tipo) => {
                  return (
                    <option name='tipo_cuenta' value={tipo.value}>
                      {tipo.text}
                    </option>
                  );
                })}
              </select>
              <br />
              <label>Descripcion</label>
              <input
                className='form-control'
                type='text'
                name='descripcion'
                value={cuentaSeleccionada ? cuentaSeleccionada.descripcion : ''}
                onChange={handleChange}
                required
              />
              <br />
              <label style={{ color: 'black' }}>Movimiento</label>
              <select
                name='movimiento'
                onChange={handleChange}
                className='form-control'>
                <option>Seleccionar si tiene Movimiento</option>
                {movimiento.map((tipo) => {
                  return (
                    <option name='movimiento' value={tipo.value}>
                      {tipo.text}
                    </option>
                  );
                })}
              </select>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className='btn btn-primary' onClick={postCuentas}>
              Insertar
            </button>
            <button
              className='btn btn-danger'
              onClick={() => setModalInsertar(false)}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
}
