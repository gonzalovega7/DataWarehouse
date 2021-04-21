import React, { useState, useContext } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { GrEdit } from 'react-icons/gr';
import { FaTrash } from 'react-icons/fa';
import { ProgressBar } from 'react-bootstrap'
import { UserFormContext } from '../context/usersFormContext';
import { CompaniesContext } from '../context/companiesContext';
// import Acciones from './acciones'
import { Form } from 'react-bootstrap';
import './css/userRow.css'


function TableRows({ where, data, displayEditContacts }) {
    const [displayActions, setDisplayActions] = useState(false);
    const { modifyUser, deleteFromDB } = useContext(UserFormContext);
    const { deleteCompanyFromDB } = useContext(CompaniesContext);

    const blurActions = (bool) => {
        setDisplayActions(bool)
    }
    if (where === '/contacts') {
        const { contact_id, city, company, interest, mail, name, position, regions, surname } = data;

        return (

            <tr onMouseEnter={() => blurActions(true)} onMouseLeave={() => blurActions(false)}>
                <td>{contact_id}</td>
                <td className='grid-contacto'><label> {`${name} ${surname}`}</label> <label className='contacto-desc label-desc'>{mail}</label></td>
                <td ><span className="grid-pais">{city} <label className='label-desc'>{regions}</label></span></td>
                <td className='td-align'>{company}</td>
                <td className='td-align'>{position}</td>
                <td className='td-align porcentaje'><ProgressBar variant="success" label={`${interest}`} now={interest?.split('%')[0]} /></td>
                {/* <td className='acciones'><BiDotsHorizontalRounded onClick={clickAcciones} /><Acciones displayAcciones={displayAcciones} /></td> */}
                <td className='acciones'>{(displayActions) ? <span ><FaTrash className='icon-hover' onClick={() => deleteFromDB(contact_id, 'contacts')} /><GrEdit className='icon-hover' onClick={(e) => displayEditContacts({ contact_id: contact_id, name: name, surname: surname, mail: mail, city: city, regions: regions, company: company, position: position, interest: interest })} /></span> : <BiDotsHorizontalRounded />}</td>
            </tr>

        )
    } else if (where === '/users') {
        const { user_id, name, surname, mail, admin, phone } = data
        return (
            <tr onMouseEnter={() => blurActions(true)} onMouseLeave={() => blurActions(false)}>
                <td className='td-align'>ID: {user_id}</td>
                <td className='grid-contacto'> {`${name} ${surname}`} <label className='contacto-desc label-desc'>{mail}</label></td>
                {/* <td ><span className="grid-pais">{city} <label className='label-desc'>{regions}</label></span></td> */}
                <td className='td-align'>{phone}</td>
                <td className='td-align'>
                    <Form.Check
                        type="switch"
                        id={`custom-switch-${user_id}`}
                        name='admin'
                        defaultChecked={admin}
                        label="Permisos de Administrador"
                        onChange={(e) => modifyUser(user_id, { admin: `${Number(e.target.checked)}` })}
                    />
                </td>
                <td className='acciones'>{(displayActions) ? <span ><FaTrash className='icon-hover' onClick={() => deleteFromDB(user_id, 'users')} /><GrEdit className='icon-hover' onClick={(e) => displayEditContacts({user_id:user_id, name: name, surname: surname, mail: mail, admin: admin, phone: phone })} /></span> : <BiDotsHorizontalRounded />}</td>
            </tr>
        )
    } else if (where === '/companies') {
        const { company_id, company, address, mail, phone, city, region } = data
        return (
            <tr onMouseEnter={() => blurActions(true)} onMouseLeave={() => blurActions(false)}>
                <td className='td-align'>{company_id}</td>
                <td className='grid-contacto'>{`${company}`} <label className='contacto-desc label-desc'>{mail}</label></td>
                <td ><span className="grid-pais">{city} <label className='label-desc'>{region}</label></span></td>
                {/* <td className='td-align'>{company}</td> */}
                <td className='td-align'>{address}</td>
                <td className='td-align'>{phone}</td>
                <td className='acciones'>{(displayActions) ? <span ><FaTrash className='icon-hover' onClick={() => deleteCompanyFromDB(company_id)} /><GrEdit className='icon-hover' onClick={(e) => displayEditContacts({ company_id: company_id, company: company, address: address, mail: mail, phone: phone, city: city, region: region })} /></span> : <BiDotsHorizontalRounded />}</td>

            </tr>
        )
    }
}
export default TableRows;

