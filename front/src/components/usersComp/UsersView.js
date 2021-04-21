
import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserFormContext } from '../../context/usersFormContext'
import TableComp from '../table';
import EditModal from '../supportComp/editModal'
import UserForm from './newUserView'
import '../css/usersComp.css'

function UserComp() {
    const { getAllUsers, allUser } = useContext(UserFormContext);
    const [modalStatus, setModalStatus] = useState(false);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        getAllUsers();
        console.log(allUser)
    }, []);

    const displayEditContacts = (values) => {
        setModalStatus(true);
        setModalData(values)
    }

    return (
        <div className='companies-view-div'>
            <h1>Usuarios</h1>
            <div className='userComp-div'>
                <NavLink className='generic-button' to={{ pathname: `/users/newUser` }}> Crear nuevo usuario </NavLink>
            </div>
            <TableComp info={allUser} displayEditContacts={displayEditContacts} >
                <th className='row-ex-ch'>User ID </th>
                <th className='row-mdno'> Datos Usuario </th>
                <th className='row-mdno'>Telefono </th>
                <th className='row-gde'> Permisos </th>
                <th className='row-ex-ch'>Acciones</th>
            </TableComp>
            <EditModal modalStatus={modalStatus} title='Usuario' setModalStatus={setModalStatus}>
                <UserForm data={modalData} setModalStatus={setModalStatus} />
            </EditModal>
        </div>
    )
}

export default UserComp;



