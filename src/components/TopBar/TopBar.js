import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

import {
  BsFillArchiveFill,
  BsFillCalculatorFill,
  BsFillChatSquareTextFill,
} from 'react-icons/bs';

import { ImHome, ImBooks } from 'react-icons/im';
import { Icon, Image, Menu } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import './TopBar.scss';

function TopBar(props) {
  const { history, location } = props;

  const logout = () => {
    console.log('Cerrar Sesión');
  };
  const goBack = () => {
    console.log('Ir atras');
    history.goBack();
  };
  const [activeMenu, setActiveMenu] = useState(location.pathname);

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  const handleMenu = (e, nav) => {
    setActiveMenu(nav);
  };

  return (
    <div>
      <Navbar bg='dark' expand='lg' variant='dark'>
        <Container>
          <div className='top-bar__left'>
            <Icon name='angle double left' onClick={goBack} />
          </div>
          <Navbar.Brand>Sistema Informatico SIC</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto'>
              <Nav.Link
                as={Link}
                to='/'
                active={activeMenu === '/'}
                onClick={handleMenu}>
                Home <ImHome />
              </Nav.Link>
              <Nav.Link
                as={Link}
                to='/Cuentas'
                active={activeMenu === '/Cuentas'}
                onClick={handleMenu}>
                Catálogo de Cuentas <BsFillArchiveFill />
              </Nav.Link>
              <Nav.Link
                as={Link}
                to='/Libro'
                active={activeMenu === '/Libro'}
                onClick={handleMenu}>
                Libro Diario <BsFillCalculatorFill />
              </Nav.Link>
              <Nav.Link
                as={Link}
                to='/Partidas'
                active={activeMenu === '/Partidas'}
                onClick={handleMenu}>
                Partidas <BsFillChatSquareTextFill />
              </Nav.Link>
              <NavDropdown title='Reportes'>
                <NavDropdown.Item
                  as={Link}
                  to='/Balance'
                  active={activeMenu === '/Balance'}
                  onClick={handleMenu}>
                  Balance General
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to='/Estado'
                  active={activeMenu === '/Estado'}
                  onClick={handleMenu}>
                  Estado de Resultados
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default withRouter(TopBar);
