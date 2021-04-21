// ------------------------------------------------------------------------------ //
//     File:       loginContext.js ---------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

import { createContext, useState, useRef, useEffect } from 'react';


export const LogInContext = createContext();


const LogInProvider = ({ children }) => {

    //FIJRSE DE HACER UN TIMER QUE CORRA CADA 15/20 MINUTOS DE USO DE LA APP QUE HAGA FETCH PARA COMPARAR LOS JWT O ALGO ASI
    //SI NO COINCIDEN QUE TE SAQUE DE LA SESION...

    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [infoContacts, setInfoContacts] = useState([]);
    const [tokenState, setToken] = useState(null);
    const [userMail, setUserMail] = useState(null);
    const [userAdmin, setUserAdmin] = useState(null);
    const [logInStatus, setLogInStatus] = useState(null);
    const [logInFailed, setLogInFailed] = useState(null);
    // const [infoContactsPrueba, setInfoContactsPrueba] = useState([]);
    const [pagination, setPagination] = useState([]);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    useEffect(() => {
        if (tokenState) {
            GetUserData(tokenState, 0)
            console.log(tokenState)
        };
    }, [tokenState])

    const LogIn = (mail, pass) => {
        setLogInStatus(true)
        var raw = JSON.stringify({ "mail": mail.toLowerCase(), "pass": pass.toLowerCase() });
        console.log(raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:9000/users/login", requestOptions)
            .then(response => response.json())
            .then(result => {

                if (result.requestInfo.code === 401) {
                    console.log('que tire errorf')
                    setLogInStatus(null)
                    setLogInFailed(true)
                };
                setTokenCallback(result.data.token, result.data.isAuthenticated, result.data.mail, result.data.admin)
                if (!result.data.isAuthenticated) {
                    userHasAuthenticated(result.data.isAuthenticated)
                }
            })

            .catch(error => console.log('error', error));
    }
    const setTokenCallback = (receivedToken, auth, mail, admin) => {
        setToken(receivedToken);
        userHasAuthenticated(auth);
        setUserMail(mail);
        setUserAdmin(admin);

    }

    const GetUserData = (token, offset) => {
        console.log('corre el getUserData')

        myHeaders.append("Authorization", `Bearer ${token}`);
        console.log(`Bearer ${token}`)

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`http://localhost:9000/contacts?offset=${offset}`, requestOptions)
            .then(response => response.json())
            .then(result => {

                console.log('result')
                console.log(result)
                setInfoContacts(result.data.data)
                setPagination(result.PaginationInfo)
                if (!result.data.isAuthenticated) {
                    userHasAuthenticated(result.data.isAuthenticated)
                }
            })
            .catch(error => console.log('error', error));
    }







    return (
        <LogInContext.Provider
            value={{
                userMail: userMail,
                userAdmin: userAdmin,
                tokenState: tokenState,
                infoContacts: infoContacts,
                pagination: pagination,
                logInStatus: logInStatus,
                logInFailed: logInFailed,
                LogIn: LogIn,
                isAuthenticated: isAuthenticated,
                userHasAuthenticated: userHasAuthenticated,
                setInfoContacts: setInfoContacts,
                GetUserData: GetUserData,
                setTokenCallback: setTokenCallback,
                setLogInFailed:setLogInFailed
            }}
        >
            {children}
        </LogInContext.Provider>
    );
}
export default LogInProvider;


