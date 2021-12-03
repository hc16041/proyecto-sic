import React from 'react';
import { Grid } from 'semantic-ui-react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from '../../routes/Routes';
import MenuLeft from '../../components/MenuLeft';
import TopBar from '../../components/TopBar';

import './InicioLayout.scss';

export default function InicioLayout() {
  return (
    <Router>
      <Grid className='inicio-layout'>
        <Grid.Row>
          <Grid.Column className='content'>
            <TopBar />
            <Routes />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Router>
  );
}
