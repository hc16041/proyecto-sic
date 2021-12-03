import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Table } from 'react-bootstrap';
import ReactHTMLTabletoExcel from 'react-html-table-to-excel';
import axios from 'axios';

export default function Balance_general() {
  const [Cuentas, setCuentas] = useState([]);

  const baseUrl = 'http://localhost:5000';
  const getCuentas = async () => {
    try {
      await axios.get(`${baseUrl}/general`).then((respuesta) => {
        setCuentas(respuesta.data);
        console.log(respuesta.data);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    async function cuentas() {
      await getCuentas();
    }
    cuentas();
  }, []);
  return (
    <div className=' container-fluid' style={{ 'text-align': 'center' }}>
      <h1>Consultoria e Ingenieria de Obra Civil</h1>
      <h2>Balance General</h2>
      <br></br>

      <Card>
        <Card.Header as='h5'>Crea tu reporte </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <br></br>{' '}
              <ReactHTMLTabletoExcel
                id='botonExportarExcel'
                variant='success'
                table='Balance'
                filename='balance general'
                sheet='pagina 1'
                buttonText='Exportar a Excel'></ReactHTMLTabletoExcel>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Row>
        <br></br>
        <Card>
          <Table id='Balance' striped bordered hover variant='dark'>
            <thead>
              <tr>
                <th>Nivel de Cuenta</th>
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Total($)</th>
              </tr>
            </thead>
            <tbody>
              {Cuentas &&
                Cuentas.map((elemento) => {
                  return (
                    <tr>
                      <td>{elemento.nivel}</td>
                      <td>{elemento.codigo}</td>
                      <td>{elemento.nombre}</td>
                      <td>{elemento.saldo}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <br />
          <footer class='page-footer font-small blue'>
            <div
              style={{ color: 'black' }}
              class='footer-copyright text-center py-3'>
              <p>Sistema Informatico SIC-Grupo 05-UES-2021</p>
            </div>
          </footer>
        </Card>
      </Row>
    </div>
  );
}
