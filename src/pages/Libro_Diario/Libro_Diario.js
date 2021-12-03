import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

export default function Home() {
  const [Movimientos, setMovimientos] = useState([]);
  const [Cuentas, setCuentas] = useState([]);
  const [cuentasnombre, setcuentasnombre] = useState([]);
  const [TablaMovimientos, setTablaMovimientos] = useState([]);

  const [busqueda, setbusqueda] = useState('');
  const [MovimientoSeleccionado, setMovimientoSeleccionado] = useState({
    cuenta: '',
    debe: '',
    haber: '',
    id_partida: '',
    descripcion_movimiento: '',
  });

  const [modalEditor, setmodalEditor] = useState(false);
  const [modalEliminar, setmodalEliminar] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const baseUrl = 'http://localhost:5000';
  const getMovimientos = async () => {
    try {
      await axios.get(`${baseUrl}/movimientos`).then((respuesta) => {
        setMovimientos(respuesta.data);
        setTablaMovimientos(respuesta.data);
      });
      getCuentas();
      getCuentasNombres();
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCuentasNombres = async () => {
    try {
      await axios.get(`${baseUrl}/cuentas/nombre`).then((respuesta) => {
        setcuentasnombre(respuesta.data);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const getCuentas = async () => {
    try {
      await axios.get(`${baseUrl}/cuentas`).then((respuesta) => {
        setCuentas(respuesta.data);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const putMovimientos = async () => {
    let movimiento;
    if (MovimientoSeleccionado.debe === '') {
      MovimientoSeleccionado.debe = 0;
    } else if (MovimientoSeleccionado.haber === '') {
      MovimientoSeleccionado.haber = 0;
    }

    movimiento = Object.assign(MovimientoSeleccionado, value);
    let saldo = movimiento.debe - movimiento.haber;
    saldo = Math.abs(saldo);
    movimiento = Object.assign(MovimientoSeleccionado, { saldo });
    delete movimiento.cuenta;

    console.log(movimiento);
    try {
      await axios
        .put(
          `${baseUrl}/movimientos/${MovimientoSeleccionado.id_movimiento}`,
          movimiento
        )
        .then((respuesta) => {
          setMovimientos(Movimientos.concat(respuesta.data));
          setmodalEditor(false);
        });
      getMovimientos();
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteMovimientos = async () => {
    await axios
      .delete(`${baseUrl}/movimientos/${MovimientoSeleccionado.id_movimiento} `)
      .then((respuesta) => {
        setMovimientos(
          Movimientos.filter(
            (Cuentas) =>
              Movimientos.id_movimiento !== MovimientoSeleccionado.id_movimiento
          )
        );
        getMovimientos();
        setmodalEliminar(false);
      });
  };

  useEffect(() => {
    async function movimientos() {
      await getMovimientos();
    }
    movimientos();
  }, []);
  const [value, setValue] = useState();

  //HANDLES
  const handleChanger = useCallback((inputValue) => {
    let codigo = inputValue.value;
    setValue({ codigo: codigo });
  }, []);
  //BUSQUEDA
  const handleChangeBuscar = (e) => {
    setbusqueda(e.target.value);
    filtrar(e.target.value);
    console.log(e.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = Movimientos.filter((elemento) => {
      if (
        elemento.cuenta
          .toString()
          .toLowerCase()
          .startsWith(terminoBusqueda.toLowerCase()) ||
        elemento.id_partida
          .toString()
          .toLowerCase()
          .startsWith(terminoBusqueda.toLowerCase())

        //en vez de startWith se puede usar includes si se quiere una que contenga cierto dato
      ) {
        return elemento;
      }
    });
    setTablaMovimientos(resultadosBusqueda);
  };

  const seleccionarMovimiento = (elemento, caso) => {
    setMovimientoSeleccionado(elemento);
    caso === 'Editar' ? setmodalEditor(true) : setmodalEliminar(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovimientoSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(MovimientoSeleccionado);
  };

  return (
    <>
      <div className='container-fluid' style={{ 'text-align': 'center' }}>
        <h1>Consultoria e Ingenieria de Obra civil</h1>
        <h2>Libro Diario</h2>
        <br />
        <div className='containerInput'>
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
        <div className='table-responsive'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>N° PARTIDA</th>
                <th>CUENTA</th>
                <th>DEBE</th>
                <th>HABER</th>
                <th>DESCRIPCION</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {TablaMovimientos &&
                TablaMovimientos.map((elemento) => {
                  return (
                    <>
                      <tr>
                        <td>{elemento.id_partida}</td>
                        <td>{elemento.cuenta}</td>
                        <td>{elemento.debe}</td>
                        <td>{elemento.haber}</td>
                        <td>{elemento.descripcion_movimiento}</td>
                        <td>
                          <button
                            className='btn btn-primary'
                            onClick={() =>
                              seleccionarMovimiento(elemento, 'Editar')
                            }>
                            Editar
                          </button>{' '}
                          <button
                            className='btn btn-danger'
                            onClick={() =>
                              seleccionarMovimiento(elemento, 'Eliminar')
                            }>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    </>
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
      </div>

      <Modal isOpen={modalEditor}>
        <ModalHeader>
          <div>
            <h3>Editar Movimiento</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <form class='form-group'>
            <h4 align='left'>Movimientos</h4>
            <label id='id_partida' className='id_partida'>
              N° Partida
            </label>
            <input
              className='form-control'
              readOnly
              type='text'
              name='id_partida'
              id='id_partida'
              value={
                MovimientoSeleccionado && MovimientoSeleccionado.id_partida
              }
              onChange={handleChange}
            />
            <br />
            <label>Cuenta</label>
            <Select
              className='basic-single'
              classNamePrefix='select'
              isSearchable={true}
              name='codigo'
              options={cuentasnombre}
              defaultValue={selectedOption}
              onChange={handleChanger}
            />
            <label>Debe</label>
            <input
              disabled={
                MovimientoSeleccionado.haber !== '' &&
                MovimientoSeleccionado.haber !== 0
              }
              type='text'
              class='form-control col-sm-1'
              id='debe'
              name='debe'
              value={MovimientoSeleccionado ? MovimientoSeleccionado.debe : ''}
              onChange={handleChange}
            />
            <br />
            <label for='floatingInputGrid'>Haber</label>
            <input
              disabled={
                MovimientoSeleccionado.debe !== '' &&
                MovimientoSeleccionado.debe !== 0
              }
              type='text'
              class='form-control col-sm-1'
              id='haber'
              name='haber'
              value={MovimientoSeleccionado && MovimientoSeleccionado.haber}
              onChange={handleChange}
            />
            <br />
            <label>Descripción</label>
            <input
              type='text'
              class='form-control'
              name='descripcion_movimiento'
              value={
                MovimientoSeleccionado &&
                MovimientoSeleccionado.descripcion_movimiento
              }
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
                onClick={putMovimientos}>
                Agregar
              </button>
            </div>
          </div>
          <button
            className='btn btn-danger'
            onClick={() => setmodalEditor(false)}>
            Cancerlar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          Estás Seguro que deseas eliminar el movimiento de la Partida{' '}
          {MovimientoSeleccionado && MovimientoSeleccionado.id_partida}
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={deleteMovimientos}>
            Sí
          </button>
          <button
            className='btn btn-secondary'
            onClick={() => setmodalEliminar(false)}>
            No
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
