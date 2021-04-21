// ------------------------------------------------------------------------------ //
//     File:       companiesContext.js ------------------------------------------ //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

import { createContext, useState, useContext, useEffect } from 'react';
import { LogInContext } from './logInContext'



export const CompaniesContext = createContext();


const CompaniesProvider = ({ children }) => {
    const { tokenState, userHasAuthenticated } = useContext(LogInContext);
    const [allCompanies, setAllCompanies] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(null)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${tokenState}`);

    useEffect(() => {
        getAllCompanies();
    }, []);

    const addCompany = (data) => {
        setFetchStatus('fetching');
        var raw = JSON.stringify(data);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`http://localhost:9000/companies/newCompany`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (!result.data.isAuthenticated) {
                    alert('Su sesion a expirado')
                    return userHasAuthenticated(result.data.isAuthenticated)
                }
                if (result.requestInfo.code === 200) {
                    setFetchStatus(true)
                } else {
                    setFetchStatus(false)
                }
            })
            .catch(error => {
                console.log('error', error)
                setFetchStatus(false)
            })
            .finally(() => { setTimeout(() => { setFetchStatus(null) }, 1500) })

    }

    const getAllCompanies = () => {

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`http://localhost:9000/companies`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setAllCompanies(result.data.data)
                if (!result.data.isAuthenticated) {
                    alert('Su sesion a expirado')
                    userHasAuthenticated(result.data.isAuthenticated)
                }
                console.log(result.data)
            })
            .catch(error => console.log('error', error));
    }

    const modifyCompany = (id, changes) => {

        let raw = JSON.stringify(changes)
        var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`http://localhost:9000/companies/${id}/modify`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                getAllCompanies()
                if (!result.data.isAuthenticated) {
                    alert('Su sesion a expirado')
                    userHasAuthenticated(result.data.isAuthenticated)
                }

            })
            .catch(error => console.log(error));
    }
    const deleteCompanyFromDB = (id) => {

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`http://localhost:9000/companies/${id}/delete?eliminado=true`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (!result.data.isAuthenticated) {
                    alert('Su sesion a expirado')
                    return userHasAuthenticated(result.data.isAuthenticated)
                }
                getAllCompanies(tokenState, 1)

            })
            .catch(error => console.log('error', error));
    }


    return (
        <CompaniesContext.Provider
            value={{
                fetchStatus: fetchStatus,
                allCompanies: allCompanies,
                addCompany: addCompany,
                modifyCompany: modifyCompany,
                getAllCompanies: getAllCompanies,
                deleteCompanyFromDB: deleteCompanyFromDB

            }}
        >
            {children}
        </CompaniesContext.Provider>
    );
}
export default CompaniesProvider;


