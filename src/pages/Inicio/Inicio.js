import React from 'react';
import conta from '../../assets/img/conta.jpg';

export default function Inicio() {
  return (
    <div className='container-fluid'>
      <br />
      <img src={conta} alt='' width='75%' height='100%' />
      <footer class='page-footer font-small blue'>
        <div
          style={{ color: 'black' }}
          class='footer-copyright text-center py-3'>
          <p>Sistema Informatico SIC-Grupo 05-UES-2021</p>
        </div>
      </footer>
    </div>
  );
}
