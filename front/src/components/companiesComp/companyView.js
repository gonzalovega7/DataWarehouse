
import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CompaniesContext } from '../../context/companiesContext'
import TableComp from '../table';
import EditModal from '../supportComp/editModal'
import NewCompanyView from './newCompanyView'
import '../css/usersComp.css' //ESTO VA????

function CompanyView() {
    const { allCompanies } = useContext(CompaniesContext);
    const [modalStatus, setModalStatus] = useState(false);
    const [modalData, setModalData] = useState(null);

    const displayEditContacts = (values) => {
        setModalStatus(true);
        setModalData(values)
    }

    return (
        <div className='companies-view-div'>
            <h1>Companias</h1>
            <div className='userComp-div'>
                <NavLink className='generic-button' to={{ pathname: `/companies/newCompany` }}> Agregar nueva compania </NavLink>
            </div>
            <TableComp info={allCompanies} displayEditContacts={displayEditContacts} >
                <th className='row-ex-ch'>ID </th>
                <th className='row-mdno'>Nombre </th>
                <th className='row-mdno'>Ciudad</th>
                <th className='row-mdno'> Direccion </th>
                <th className='row-mdno'>Telefono </th>
                <th className='row-ex-ch'>Acciones</th>
            </TableComp>

            {/* Only works when we click on EDIT PENCIL */}
            <EditModal modalStatus={modalStatus} setModalStatus={setModalStatus} title='Compania' >
                <NewCompanyView data={modalData} setModalStatus={setModalStatus} />
            </EditModal>

        </div>
    )
}

export default CompanyView;



