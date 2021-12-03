import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Balance from '../pages/Balance_General';
import Configuraciones from '../pages/Configuraciones';
import Cuentas from '../pages/Cuentas';
import Estado from '../pages/Estado_De_Resultado';
import Inicio from '../pages/Inicio';
import Libro from '../pages/Libro_Diario';
import Movimientos from '../pages/Movimientos';
import Partidas from '../pages/Partidas';

export default function Routes() {
  return (
    <Switch>
      {/* <Route path='/' exact>
        <Login />
      </Route> */}
      <Route path='/' exact>
        <Inicio />
      </Route>
      <Route path='/Reportes' exact>
        {/* <Reportes /> */}
      </Route>
      <Route path='/Cuentas' exact>
        <Cuentas />
        {/* <Reportes /> */}
      </Route>
      <Route path='/Configuraciones' exact>
        <Configuraciones />
        {/* <Reportes /> */}
      </Route>
      <Route path='/Movimientos/:id' exact>
        <Movimientos />
        {/* <Reportes /> */}
      </Route>
      <Route path='/Partidas' exact>
        <Partidas />
        {/* <Reportes /> */}
      </Route>
      <Route path='/Partidas/:id' exact>
        <Partidas />
        {/* <Reportes /> */}
      </Route>
      <Route path='/Balance' exact>
        <Balance />
        {/* <Reportes /> */}
      </Route>
      <Route path='/Estado' exact>
        <Estado />
        {/* <Reportes /> */}
      </Route>
      <Route path='/Libro' exact>
        <Libro />
        {/* <Reportes /> */}
      </Route>
    </Switch>
  );
}
