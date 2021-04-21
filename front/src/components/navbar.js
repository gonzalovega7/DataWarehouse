import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './css/navbar.css'

function NavbarComp({ userAdmin }) {

  const [configDisplay, setConfigDisplay] = useState(null)
  return (
    <nav className='navbar'>
      <h4>OnlyGodKnows</h4>
      <ul className='navbarUl'>
        <li className='navbarLi'><NavLink activeClassName="act-navlinkLi" className='navlinkLi' to={{ pathname: `/contacts` }}> Contactos </NavLink></li>
        {(userAdmin) ? <li className='navbarLi'><NavLink activeClassName="act-navlinkLi" className='navlinkLi' to={{ pathname: `/users` }}> Usuarios</NavLink></li> : null}
        <li className='navbarLi'><NavLink activeClassName="act-navlinkLi" className='navlinkLi' to={{ pathname: `/companies` }}> Companias </NavLink></li>
        <li className='navbarLi'><NavLink activeClassName="act-navlinkLi" className='navlinkLi' to={{ pathname: `/regions` }}> Regiones/Ciudades </NavLink></li>
        <li className='navbarLi' activeClassName="act-navlinkLi" className='navlinkLi'
        onClick={()=>(configDisplay)?setConfigDisplay(false):setConfigDisplay(true)}> c

          {(configDisplay) ?
            <div className='configuration'>
              <NavLink activeClassName="act-navlinkLi" className='navlinkLi' to={{ pathname: `/configurations` }}>
                <p>Cambiar Contrasena</p>
              </NavLink>
            </div> : null
          }
        </li>
      </ul >
    </nav >
  )

}
export default NavbarComp;


