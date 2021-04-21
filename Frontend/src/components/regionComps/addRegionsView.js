import { React, useState, useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
//BOOTSTRAP
import { Form } from 'react-bootstrap';
//CONTEXT
import { RegionsContext } from '../../context/regionsContext'
import { UserTableContext } from '../../context/userTableContext'
//COMPONENTS
import Inputs from '../supportComp/inputs';
import Button from '../supportComp/button'
import '../css/form.css';
import '../css/addRegionsView.css';

function AddRegions() {


    const history = useHistory();
    // unable the section when the section above is complete
    const [showCountrySect, setShowCountrySect] = useState(false);
    const [showCitySect, setShowCitySect] = useState(false);

    //data for sq-select inputs
    const [countryData, setCountryData] = useState([]);



    const [newRegionInfo, setNewRegionInfo] = useState({});
    const { addRegions, fetchStatus } = useContext(RegionsContext);
    const { infoCountries } = useContext(UserTableContext);
    useEffect(() => {
        setNewRegionInfo({})
    }, [])
    if (fetchStatus === true) { setTimeout(() => { history.push('/regions') }, 1500) }


    const submitNewRegionInfo = (e) => {
        e.preventDefault();
        addRegions(newRegionInfo);
    }

    const getInfo = (objectTag, value) => {

        if (objectTag === 'region') {
            setNewRegionInfo({ ...newRegionInfo, region_name: value })
            setCountryData([...new Set(infoCountries.filter(a => a.region_name == value).map(x => x.country_name)), '+ Agregar Pais'])
            setShowCountrySect(true)
            setShowCitySect(false)

        }
        if (objectTag === 'country') {
            setNewRegionInfo({ ...newRegionInfo, country_name: value })
            setShowCitySect(true)
            // setCityData([...infoCountries.filter(a => a.country_name == value).map(x => x.city_name), '+ Agregar Ciudad'])

        }
        if (objectTag === 'city') { setNewRegionInfo({ ...newRegionInfo, city_name: value }) }

    }

    return (

        <section className='form-section'>
            <Form className='form-ctn' onSubmit={(e) => submitNewRegionInfo(e)}>
                <Inputs
                    label='Region'
                    objectTag='region'
                    type='sq-select'
                    data={[...new Set(infoCountries.map(x => x.region_name)), '+ Agregar region']}
                    getInfo={getInfo}
                />

                <fieldset className={`${(showCountrySect) ? 'show' : 'hideAddInput'}`}>
                    {/* <h5>Pais</h5> */}
                    <Inputs label='Pais'
                        objectTag='country'
                        type='sq-select'
                        // defaultValue={data?.company}
                        //despues cambiar la data de este input por un map!
                        data={countryData}
                        getInfo={getInfo} />

                </fieldset>


                <fieldset className={`${(showCitySect) ? 'show' : 'hideAddInput'}`}>
                    {/* <h5>Ciudad</h5> */}
                    <Inputs label='Ciudad'
                        objectTag='city'
                        type='sq-select'
                        data={['+ Agregar Ciudad']}
                        moreInformation={`Ciudades de ${newRegionInfo?.country_name} ya agregadas: ${infoCountries.filter(a => a.country_name == newRegionInfo?.country_name).map(x => ' ' + x.city_name)}`}

                        getInfo={getInfo} />

                </fieldset>
                {(newRegionInfo.region_name) ? <h6>Informacion a agregar</h6> : ''}
                <p>{`
                ${(newRegionInfo.region_name) ? newRegionInfo.region_name : ''}
                ${(newRegionInfo.country_name) ? ' - ' + newRegionInfo.country_name : ''}
                ${(newRegionInfo.city_name) ? ' - ' + newRegionInfo.city_name : ''}`
                }</p>

                <Button fetchStatus={fetchStatus} disabledParam={!newRegionInfo.city_name} tagName={'Agregar'} />
            </Form>
        </section>
    )
}
export default AddRegions;

