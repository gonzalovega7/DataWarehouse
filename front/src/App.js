// ------------------------------------------------------------------------------ //
//     File:       App.js ------------------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
//COMPONENTS
import NavbarComp from './components/navbar';
import Login from './components/LoginView';
import ContactsComp from './components/contactsComp/ContactsView';
import UsersComp from './components/usersComp/UsersView';
import CompanyView from './components/companiesComp/companyView';
import UserForm from './components/usersComp/newUserView';
import NewCompany from './components/companiesComp/newCompanyView';
import NewContacForm from './components/contactsComp/newContactForm';
import RegionsView from './components/regionComps/RegionsView';
import AddRegions from './components/regionComps/addRegionsView';
// CONTEXTS
import { LogInContext } from '../src/context/logInContext';
import UserFormProvider from '../src/context/usersFormContext';
import UserTableProvider from '../src/context/userTableContext';
import CompaniesProvider from '../src/context/companiesContext';
import RegionsProvider from '../src/context/regionsContext';



function App() {

  const { isAuthenticated, userAdmin } = useContext(LogInContext)


  if (!isAuthenticated) {
    return (
      <div className="App logIn">
        <BrowserRouter>
          <Login />
        </BrowserRouter>

      </div>
    );
  }
  else {
    return (

      <div className="App">
        <UserFormProvider>
          <BrowserRouter>
            <UserTableProvider>
              <CompaniesProvider>
                <RegionsProvider>

                  <Redirect to='/contacts' />
                  <NavbarComp userAdmin={userAdmin} />

                  <Switch>
                    <Route exact path='/contacts/newContact' ><NewContacForm /></Route>
                    <Route exact path='/contacts' ><ContactsComp /></Route>
                    <Route path='/users/newUser' >{(userAdmin) ? <UserForm /> : null}</Route>
                    <Route path='/users' >{(userAdmin) ? <UsersComp /> : null}</Route>
                    <Route path='/companies/newCompany' ><NewCompany /></Route>
                    <Route path='/companies' ><CompanyView /></Route>
                    <Route path='/regions/addNew' ><AddRegions /></Route>
                    <Route path='/regions' ><RegionsView /></Route>

                    <Route ><h1>Page not found</h1></Route>
                  </Switch>


                </RegionsProvider>
              </CompaniesProvider>
            </UserTableProvider>
          </BrowserRouter>
        </UserFormProvider>
      </div>

    );
  }
}

export default App;
