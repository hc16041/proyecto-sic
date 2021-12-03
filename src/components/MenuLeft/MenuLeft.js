import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';
import './MenuLeft.scss';

function MenuLeft(props) {
  const { location } = props;

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [contentModal, setContentModal] = useState(null);
  const [activeMenu, setActiveMenu] = useState(location.pathname);

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  const handleMenu = (e, menu) => {
    setActiveMenu(menu.to);
  };

  return (
    <>
      <Menu className='menu-left' vertical>
        <div className='top'>
          <Menu.Item
            as={Link}
            to='/'
            name='home'
            active={activeMenu === '/'}
            onClick={handleMenu}>
            <Icon name='home' />
            Movimientos
          </Menu.Item>
          <Menu.Item
            as={Link}
            to='/Contabilidad'
            name='contabilidad'
            active={activeMenu === '/Contabilidad'}
            onClick={handleMenu}>
            <Icon name='money' />
            Contabilidad
          </Menu.Item>
          <Menu.Item
            as={Link}
            to='/Cuentas'
            name='cuentas'
            active={activeMenu === '/Cuentas'}
            onClick={handleMenu}>
            <Icon name='add circle' />
            Cuentas
          </Menu.Item>
        </div>
        <div className='footer'>
          <Menu.Item>
            <Icon name='plus square outline' />
            Nueva cuenta
          </Menu.Item>
        </div>
      </Menu>
    </>
  );
}

export default withRouter(MenuLeft);
