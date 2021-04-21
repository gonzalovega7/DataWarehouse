import { useContext } from 'react';
import { UserTableContext } from '../../context/userTableContext'

function ContactsSearchForm({ hiddenSearch, infoContactsSort }) {


    const { infoCountries, addItemToSearch } = useContext(UserTableContext);

    return (
        <form className='search-form' hidden={hiddenSearch}>
            <div className='search-form-divs'>
                <label>Nombre contacto:</label>
                <input type='text' className='search-form-inputs' placeholder='Introduce el nombre del contacto.' onKeyDown={(e) => addItemToSearch(e, 'name')} />
            </div>
            <div className='search-form-divs'>
                <label>Cargo:</label>
                <input type='text' className='search-form-inputs' placeholder='Introduce el cargo del contacto.' onKeyDown={(e) => addItemToSearch(e, 'position')} />
            </div>
            <div className='search-form-divs'>
                <label>Ciudad:</label>

                <select name="city" className='search-form-selects' id="cities" onKeyDown={(e) => addItemToSearch(e, 'city')}>
                    <option value="todas">Todos</option>
                    {infoCountries?.map((data, key) => (
                        <option key={`op-city-${key}`} value={data.city_name}>{data.city_name}</option>
                    )
                    )}
                </select>
            </div>
            <div className='search-form-divs'>
                <label>Pais:</label>

                <select name="country" className='search-form-selects' id="countries" onKeyDown={(e) => addItemToSearch(e, 'country')}>
                    <option value="todas">Todos</option>

                    {[...new Set(infoCountries?.map(data => data.country_name))]?.map((data, key) => (
                        <option key={`op-country-${key}`} value={data}>{data}</option>
                    )
                    )}
                </select>
            </div>
            <div className='search-form-divs'>
                <label>Region:</label>

                <select name="region" className='search-form-selects' id="regions" onKeyDown={(e) => addItemToSearch(e, 'region')}>
                    <option value="todas">Todos</option>

                    {[...new Set(infoCountries?.map(data => data.region_name))]?.map((data, key) => (
                        <option key={`op-region-${key}`} value={data}>{data}</option>
                    )
                    )}
                    {/* {infoCountries?.map((data, key) => (
                        <option key={`op-city-${key}`} value={data.city}>{data.city}</option>
                    )
                    )} */}
                </select>
            </div>
            <div className='search-form-divs'>
                <label>Compania:</label>
                <select name="company" className='search-form-selects' id="companies" onKeyDown={(e) => addItemToSearch(e, 'company')}>
                    <option value="todas" disabled>Todas</option>
                    {[...new Set(infoContactsSort?.map(data => data.company))]?.map((data, key) => (
                        <option key={`op-company-${key}`} value={data}>{data}</option>
                    )
                    )}
                </select>
            </div>
            <div className='search-form-divs'>
                <label>Interes:</label>
                <select name="interest" className='search-form-selects' id="interests" onKeyDown={(e) => addItemToSearch(e, 'interest')}>
                    <option value="volvo">Cualquiera</option>
                    <option value="0%">0%</option>
                    <option value="25">25%</option>
                    <option value="50">50%</option>
                    <option value="75">75%</option>
                    <option value="100">100%</option>
                </select>
            </div>

        </form>
    )
}
export default ContactsSearchForm;