import React from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';

import ReactHTMLTabletoExcel from 'react-html-table-to-excel';

export default function Estado_De_Resultado() {
  return (
    <div className='container-fluid' style={{ 'text-align': 'center' }}>
      <h1>Consultoria e Ingenieria de Obra Civil</h1>
      <h2>Estado de Resultado</h2>
      <br></br>

      <Card>
        <Card.Header as='h5'>Crea tu reporte</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <br></br>
              <br></br>{' '}
              <ReactHTMLTabletoExcel
                id='botonExportarExcel'
                classname='btn btn-success'
                table='Balance'
                filename='Estado de Resultado'
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
            <tbody>
              <tr>
                <td>Ingreso de operacion</td>
                <td></td>
                <td>4000</td>
              </tr>
              <tr>
                <td>Ingresos por venta</td>
                <td>4000</td>
                <td></td>
              </tr>
              <tr>
                <td>Utilidad Bruta</td>
                <td></td>
                <td>4000</td>
              </tr>
              <tr>
                <td>Menos</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>GASTOS DE OPERACION</td>
                <td></td>
                <td>2000</td>
              </tr>
              <tr>
                <td>Gastos de Administración</td>
                <td>1000</td>
                <td></td>
              </tr>
              <tr>
                <td>Gastos de Venta</td>
                <td>400</td>
                <td></td>
              </tr>
              <tr>
                <td>Gastos Financieros</td>
                <td>600</td>
                <td></td>
              </tr>
              <tr>
                <td>UTILIDAD antes de Reversa e Impuestos</td>
                <td></td>
                <td>2000</td>
              </tr>
              <tr>
                <td>Reserva Legal</td>
                <td></td>
                <td>2000</td>
              </tr>
              <tr>
                <td>UTILIDAD antes de ISR</td>
                <td></td>
                <td>2000</td>
              </tr>
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
