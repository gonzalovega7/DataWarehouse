import { React, useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import { Form } from 'react-bootstrap';
import '../css/form.css';
import { UserTableContext } from '../../context/userTableContext'
import { CompaniesContext } from '../../context/companiesContext'
import Inputs from '../supportComp/inputs';
import Button from '../supportComp/button';


function NewCompany({ data, setModalStatus }) {
    const history = useHistory();
    const [newUserInfo, setNewUserInfo] = useState({});
    const { infoCountries } = useContext(UserTableContext)
    const { addCompany, modifyCompany, fetchStatus } = useContext(CompaniesContext);

    const submitNewCompany = (e) => {
        e.preventDefault();
        addCompany(newUserInfo);
    }

    const submitCompanyModified = (e, id) => {
        e.preventDefault();
        modifyCompany(id, newUserInfo);
        setModalStatus(false)
    }
    if (fetchStatus === true) { setTimeout(() => { history.push('/companies') }, 1500) }

    const getInfo = (objectTag, value) => {

        if (objectTag === 'company') setNewUserInfo({ ...newUserInfo, company_name: value })
        if (objectTag === 'address') setNewUserInfo({ ...newUserInfo, company_address: value })
        if (objectTag === 'mail') setNewUserInfo({ ...newUserInfo, mail: value })
        if (objectTag === 'phone') setNewUserInfo({ ...newUserInfo, phone: value })
        if (objectTag === 'city') {
            let citiID = infoCountries.find(x => x.city_name == value).city_id
            setNewUserInfo({ ...newUserInfo, city_id: citiID })
        }
    }

    return (

        <section className={`form-section ${(data) ? 'form-section-modal' : null}`}>
            <Form className={`form-ctn ${(data) ? 'form-ctn-modal' : null} `} onSubmit={(e) => (!data) ? submitNewCompany(e) : submitCompanyModified(e, data.company_id)} >
                <h5>Informacion </h5>
                <Inputs label='Compania' objectTag='company' type='text' defaultValue={data?.company} getInfo={getInfo} />
                <Inputs label='Direccion' objectTag='address' type='text' defaultValue={data?.address} getInfo={getInfo} />
                <Inputs label='Mail de contacto' objectTag='mail' type='mail' defaultValue={data?.mail} getInfo={getInfo} />
                <Inputs label='Telefono' objectTag='phone' type='text' defaultValue={data?.phone} getInfo={getInfo} />
                <Inputs
                    label='Ciudad'
                    objectTag='city'
                    type='sq-select'
                    defaultValue={data?.city}
                    data={Array.from(infoCountries.map(item => item.city_name))}
                    getInfo={getInfo} />

                <Button fetchStatus={fetchStatus} tagName='Guardar'/>

            </Form>
        </section>
    )
}
export default NewCompany;