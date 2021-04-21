import { React, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
//BOOTSTRAP
import { Form } from 'react-bootstrap';
//CONTEXT
import { UserFormContext } from '../../context/usersFormContext'
//COMPONENTS
import Inputs from '../supportComp/inputs';
import Button from '../supportComp/button';
//CSS
import '../css/form.css';


function UserForm({ data, setModalStatus }) {

    const history = useHistory();
    const [newUserInfo, setNewUserInfo] = useState({ admin: 0 });
    const { addUser, modifyUser, fetchStatus } = useContext(UserFormContext);


    const submitNewUser = (e) => {
        e.preventDefault();
        addUser(newUserInfo);
    }
    const submitUserModified = (e, id) => {
        e.preventDefault();
        modifyUser(id, newUserInfo);
        setModalStatus(false)
    }

    if (fetchStatus === true) { setTimeout(() => { history.push('/users') }, 1500) }

    const getInfo = (objectTag, value) => {

        if (objectTag === 'name') setNewUserInfo({ ...newUserInfo, name: value })
        if (objectTag === 'surname') setNewUserInfo({ ...newUserInfo, surname: value })
        if (objectTag === 'mail') setNewUserInfo({ ...newUserInfo, mail: value })
        if (objectTag === 'pass') setNewUserInfo({ ...newUserInfo, pass: value })
        if (objectTag === 'admin') setNewUserInfo({ ...newUserInfo, admin: value })
        if (objectTag === 'phone') setNewUserInfo({ ...newUserInfo, phone: value })
        console.log(newUserInfo)
    }
    return (

        <section className={`form-section ${(data) ? 'form-section-modal' : null}`}>
            <Form className={`form-ctn ${(data) ? 'form-ctn-modal' : null} `} onSubmit={(e) => (!data) ? submitNewUser(e) : submitUserModified(e, data.user_id)} >
                <h5>Informacion personal</h5>
                <Inputs label='Nombre' objectTag='name' type='text' defaultValue={data?.name} getInfo={getInfo} />
                <Inputs label='Apellido' objectTag='surname' type='text' defaultValue={data?.surname} getInfo={getInfo} />
                <Inputs label='Mail' objectTag='mail' type='mail' defaultValue={data?.mail} getInfo={getInfo} />
                <Inputs label='Telefono' objectTag='phone' type='text' defaultValue={data?.phone} getInfo={getInfo} />
                {
                    (!data) ? (
                        <>
                            <h5>Informacion de Cuenta</h5>
                            <Inputs label='Contraseña' objectTag='pass' type='password' getInfo={getInfo} />
                            <Inputs label='Repita la contraseña' objectTag='passValidation' type='password' getInfo={getInfo} />

                            <h5>Permisos</h5>
                            <Form.Group controlId="formProfile" className='blockGroup'>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    name='admin'
                                    label="Permisos de Administrador"
                                    onChange={(e) => getInfo('admin', Number(e.target.checked))}
                                />
                                <p className='p-alert'>Al habilitar los permisos de administrador permiten al usuario poder crear, eliminar y editar otros usuarios.</p>
                            </Form.Group>

                        </>) : (null)
                }

                {(!data) ? <Button fetchStatus={fetchStatus} tagName={'Agregar'} /> : <Button fetchStatus={fetchStatus} tagName={'Modificar'} />}

            </Form>
        </section>
    )
}
export default UserForm;