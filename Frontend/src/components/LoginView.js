import React, { useState, useContext } from 'react';
import { Form, Card, Button, Modal } from 'react-bootstrap';
import './css/login.css'
import { LogInContext } from '../context/logInContext';

function Login() {

    const { LogIn, logInStatus, logInFailed, setLogInFailed } = useContext(LogInContext)
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');


    const validateForm = () => {
        return !!email.length && !!pass.length
    }
    const loginEnter = (e) => {
        if (e.keyCode === 13 && !!email.length && !!pass.length) {
            LogIn(email, pass)
        }
    }
    return (
        <Card className='card'>
            <h1>Ingreso a OnlyGodKnows</h1>
            {/* <Card.Body> */}
            <Form className="mg10-4">
                <Form.Group controlId="formGroupEmail">
                    <Form.Label>Direccion de Email</Form.Label>
                    <Form.Control className='input' type="email" value={email} placeholder="Ingrese su mail"
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setLogInFailed(null)}
                        onKeyDown={(e) => loginEnter(e)} />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control className='input' type="password" value={pass} placeholder="Contraseña"
                        onChange={(e) => setPass(e.target.value)}
                        onFocus={() => setLogInFailed(null)}
                        onKeyDown={(e) => loginEnter(e)} />
                </Form.Group>
                {(logInFailed) ?
                    <p>Informacion de Usuario o Contrasena son incorrectos</p> :
                    null
                }
            </Form>

            <Button className="mg10-4 buttons" variant="primary" disabled={!validateForm()} onClick={() => LogIn(email, pass)}>{(!logInStatus) ? 'Iniciar Sesion' : 'Iniciando'}</Button>
            {/* </Card.Body> */}


        </Card>



    )
}
export default Login;