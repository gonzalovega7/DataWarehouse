// ------------------------------------------------------------------------------ //
//     File:       regionsContext.js -------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

import { createContext, useState, useContext } from 'react';
import { LogInContext } from './logInContext'
import { UserTableContext } from './userTableContext';



export const RegionsContext = createContext();


const RegionsProvider = ({ children }) => {
    const { tokenState, userHasAuthenticated } = useContext(LogInContext);
    const { GetCountryData } = useContext(UserTableContext);
    const [fetchStatus, setFetchStatus] = useState(null)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${tokenState}`);


    const addRegions = (data) => {
        setFetchStatus('fetching');
        var raw = JSON.stringify(data);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`http://localhost:9000/regions/newRegion`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (!result.data.isAuthenticated) {
                    alert('Su sesion a expirado')
                    return userHasAuthenticated(result.data.isAuthenticated)
                }
                setFetchStatus(true)
                GetCountryData()
            })
            .catch(error => {
                console.log('error', error)
                setFetchStatus(false);
            })
            .finally(() => { setTimeout(() => { setFetchStatus(null) }, 1500) })

    }

    const modifyRegions = (id, where, changes) => {
        let raw = JSON.stringify(changes)
        var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`http://localhost:9000/${where}/${id}/modify`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (!result.data.isAuthenticated) {
                    alert('Su sesion a expirado')
                    return userHasAuthenticated(result.data.isAuthenticated)
                }
                GetCountryData()
            })
            .catch(error => console.log('error', error));
    }
    const deleteFromDB = (id, where) => {

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`http://localhost:9000/${where}/${id}/delete?eliminado=true`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (!result.data.isAuthenticated) {
                    alert('Su sesion a expirado')
                    return userHasAuthenticated(result.data.isAuthenticated)
                }
                GetCountryData()
            })
            .catch(error => console.log('error', error));
    }


    return (
        <RegionsContext.Provider
            value={{
                fetchStatus: fetchStatus,
                addRegions: addRegions,
                modifyRegions: modifyRegions,
                deleteFromDB: deleteFromDB

            }}
        >
            {children}
        </RegionsContext.Provider>
    );
}
export default RegionsProvider;


