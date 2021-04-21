import { React, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
//BOOTSTRAP
import { Form } from 'react-bootstrap';
//CONTEXT
import { UserFormContext } from '../../context/usersFormContext'
import { UserTableContext } from '../../context/userTableContext'
import { CompaniesContext } from '../../context/companiesContext'
//COMPONENTS
import Inputs from '../supportComp/inputs';
import Button from '../supportComp/button';
import '../css/form.css';

function NewContactForm({ data, setModalStatus }) {

    const history = useHistory();
    const [newContactInfo, setNewContactInfo] = useState({});
    const { addContact, modifyContact, fetchStatus } = useContext(UserFormContext);
    const { infoCountries } = useContext(UserTableContext);
    const { allCompanies } = useContext(CompaniesContext);
    console.log(allCompanies)

    if (fetchStatus === true) { setTimeout(() => { history.push('/contacts') }, 1500) }

    const submitNewContact = (e) => {
        e.preventDefault();
        addContact(newContactInfo);
    }
    const submitContactModified = (e, id) => {
        e.preventDefault();
        console.log(id, newContactInfo);
        modifyContact(id, newContactInfo);
        setModalStatus(false)
    }

    const getInfo = (objectTag, value) => {

        if (objectTag === 'name') setNewContactInfo({ ...newContactInfo, name: value })
        if (objectTag === 'surname') setNewContactInfo({ ...newContactInfo, surname: value })
        if (objectTag === 'mail') setNewContactInfo({ ...newContactInfo, mail: value })
        if (objectTag === 'city_name') setNewContactInfo({ ...newContactInfo, city_name: value })
        if (objectTag === 'company_name') setNewContactInfo({ ...newContactInfo, company_name: value })
        if (objectTag === 'interest') setNewContactInfo({ ...newContactInfo, interest: value })
        if (objectTag === 'position') setNewContactInfo({ ...newContactInfo, position: value })

    }

    return (

        <section className={`form-section ${(data) ? 'form-section-modal' : null}`}>
            <Form className={`form-ctn ${(data) ? 'form-ctn-modal' : null} `} onSubmit={(e) => (!data) ? submitNewContact(e) : submitContactModified(e, data.contact_id)}>
                <h5>Informacion Personal</h5>
                <Inputs label='Nombre' objectTag='name' type='text' defaultValue={data?.name} getInfo={getInfo} />
                <Inputs label='Apellido' objectTag='surname' type='text' defaultValue={data?.surname} getInfo={getInfo} />
                <Inputs label='Mail' objectTag='mail' type='mail' defaultValue={data?.mail} getInfo={getInfo} />
                <Inputs
                    label='Ciudad'
                    objectTag='city_name'
                    type='sq-select'
                    defaultValue={data?.city}
                    data={Array.from(infoCountries.map(item => item.city_name))}
                    moreInformation='Si la ciudad no se encuentra, debe agregarla desde la seccion Regiones/Ciudades.'
                    getInfo={getInfo}
                />


                <h5>Informacion de la compañia</h5>
                <Inputs label='Posicion en la compañia' objectTag='position' type='text' defaultValue={data?.position} getInfo={getInfo} />
                {/* <Inputs label='Compañia' objectTag='company' type='text' getInfo={getInfo} /> */}
                <Inputs label='Compañia'
                    objectTag='company_name'
                    type='sq-select'
                    defaultValue={data?.company}
                    data={Array.from(allCompanies.map(item => item.company))}
                    moreInformation='Si la ciudad no se encuentra, debe agregarla desde la seccion compañias.'

                    getInfo={getInfo} />
                <h5>Informacion Extra</h5>
                <Inputs label='Porcentaje de Interes'
                    objectTag='interest'
                    type='sq-select'
                    defaultValue={data?.interest}
                    data={['0%', '25%', '50%', '75%', '100%']}
                    moreInformation='Seleccione el porcentaje de interes del contacto en las propuestas que usted le ofrece.'

                    getInfo={getInfo} />


                {(!data) ?
                    <Button fetchStatus={fetchStatus} tagName={'Agregar'} />
                    :
                    <Button fetchStatus={fetchStatus} tagName={'Guardar'} disabledParam={!!newContactInfo[0]} />}




            </Form>
        </section>
    )
}
export default NewContactForm;

