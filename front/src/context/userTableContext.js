// ------------------------------------------------------------------------------ //
//     File:       userTableContext.js ------------------------------------------ //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

import { createContext, useState, useContext, useEffect } from 'react';
import { LogInContext } from './logInContext'


// el contexto es SOLO para la busqueda en si!!! fijarse de renombrarolo para no generar confusiones
export const UserTableContext = createContext();


const UserTableProvider = ({ children }) => {
    const { setInfoContacts, tokenState, userHasAuthenticated } = useContext(LogInContext);
    const [infoCountries, setInfoCountries] = useState([]);
    const [searchParameter, setSearchParameter] = useState([]);
    const [hiddenSearch, setHiddenSearch] = useState(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    useEffect(() => {
        GetCountryData();
    }, []);


    const GetCountryData = () => {

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${tokenState}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://localhost:9000/cities", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (!result.data.isAuthenticated) {
                    alert('Su sesion a experido')
                    return userHasAuthenticated(result.data.isAuthenticated)
                }

                setInfoCountries(result.data.data)
            })
            .catch(error => console.log('error', error));
    }
    const addItemToSearch = (e, parameter) => {
        console.log(searchParameter)
        let value = e.target.value.trim().toLowerCase()
        if ((e.keyCode === 13 || e.keyCode === 9) && value.length != 0) {

            if (!!searchParameter.filter((item) => Object.keys(item)[0] == parameter).length) {
                document.getElementById('div-input-search').classList.add('search-input-error')
                let parameterError;
                if (parameter == 'name') parameterError = 'nombre';
                if (parameter == 'position') parameterError = 'cargo';
                if (parameter == 'city') parameterError = 'ciudad';
                if (parameter == 'country') parameterError = 'pais';
                if (parameter == 'company') parameterError = 'compania';
                if (parameter == 'interest') parameterError = 'interes';
                document.getElementById('input-search').placeholder = `Solo se permite un valor para ${parameterError}.`

                // document.getElementById('div-input-search').classList.add('search-input-error-before')
                setTimeout(() => {
                    document.getElementById('div-input-search').classList.remove('search-input-error')
                }, 500)
                setTimeout(() => {
                    document.getElementById('input-search').placeholder = ''
                }, 2500)
            };

            // if (!searchParameter.find(item => item == value)) {
            if (!searchParameter.filter((item) => Object.keys(item)[0] == parameter).length) {
                // if(parameter==='city')setSearchParameter([...searchParameter, { city: value }]);
                if (parameter === 'name') { setSearchParameter([...searchParameter, { name: value }]); search([...searchParameter, { name: value }]) };
                if (parameter === 'position') { setSearchParameter([...searchParameter, { position: value }]); search([...searchParameter, { position: value }]) };
                if (parameter === 'city') { setSearchParameter([...searchParameter, { city: value }]); search([...searchParameter, { city: value }]) };
                if (parameter === 'country') { setSearchParameter([...searchParameter, { country: value }]); search([...searchParameter, { country: value }]) };
                if (parameter === 'region') { setSearchParameter([...searchParameter, { region: value }]); search([...searchParameter, { region: value }]) };
                if (parameter === 'company') { setSearchParameter([...searchParameter, { company: value }]); search([...searchParameter, { company: value }]) };
                if (parameter === 'interest') { setSearchParameter([...searchParameter, { interest: value }]); search([...searchParameter, { interest: value }]) };
                // search([...searchParameter, { interest: value }])

            }


            if (e.target.localName === 'input') e.target.value = '';
            if (!hiddenSearch && e.keyCode === 13) hiddenSearchModify(e);

        }
    }
    const deletePill = (value) => {
        const newSearchParameter = searchParameter.filter((item) => item[Object.keys(item)] !== value);
        setSearchParameter(newSearchParameter);
        search(newSearchParameter);
    }
    const hiddenSearchModify = (e) => {
        // console.log(e.target.localName === 'input' && hiddenSearch === false)
        if (e.target.localName === 'input' && hiddenSearch === false) {
            setHiddenSearch(true)
        } else {
            hiddenSearch ? setHiddenSearch(false) : setHiddenSearch(true);
        }
    }
    const search = (array) => {
        // console.log(array)
        let queryParams = array.map(item => `${Object.keys(item)[0]}='${item[Object.keys(item)]}'`).join('&')
        myHeaders.append("Authorization", `Bearer ${tokenState}`);
        // myHeaders.append("Content-Type", "application/json");
        console.log(queryParams)
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`http://localhost:9000/contacts?${queryParams}&offset=${0}`, requestOptions)
            .then(response => response.json())
            .then(result => {

                if (!result.data.isAuthenticated) {
                    alert('Su sesion a expirado')
                    return userHasAuthenticated(result.data.isAuthenticated)
                }
                // result.data.data.map(item => { item.isChecked = false });
                setInfoContacts(result.data.data)

            })
            .catch(error => console.log(error));

    }
    return (
        <UserTableContext.Provider
            value={{
                //VARIABLES
                infoCountries: infoCountries,
                searchParameter: searchParameter,
                hiddenSearch: hiddenSearch,
                //METHODS
                addItemToSearch: addItemToSearch,
                GetCountryData: GetCountryData,
                hiddenSearchModify: hiddenSearchModify,
                setSearchParameter: setSearchParameter,
                deletePill: deletePill,
                search: search
            }}
        >
            {children}
        </UserTableContext.Provider>
    );
}
export default UserTableProvider;


