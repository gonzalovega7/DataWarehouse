
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import './inputs.css'

function Inputs({ label, type, objectTag, getInfo, data, moreInformation, defaultValue }) {
    const [empty, setEmpty] = useState(true)
    const [classComplete, setClassComplete] = useState(false)
    const location = useLocation();
    let LabelTag;
    let pattern;
    if (!empty) { LabelTag = <label>{label}</label> }
    // if (type == 'mail') {
    //     pattern = "/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
    // }

    useEffect(() => {
        if (defaultValue) setEmpty(false)
    }, [])

    const showLabel = (e) => {

        (!!e.target.value) ? setEmpty(false) : setEmpty(true);
    }
    const deselect = (e, value) => {

        if (e.target.type != 'radio') {
            let toDeselect = document.querySelectorAll('input:checked');
            if (!!toDeselect.length) {
                for (let i = 0; i < toDeselect.length; i++) {

                    if (toDeselect[i].name.includes(value)) {
                        toDeselect[i].checked = false;
                    }
                }
            }
        } else {
            setClassComplete(false)
            let toDeselect = document.querySelectorAll('input[type=text]');
            if (!!toDeselect.length) {
                for (let i = 0; i < toDeselect.length; i++) {
                    if (toDeselect[i].name.includes(value)) {
                        toDeselect[i].value = ''
                    }
                }
            }
        }
    }

    if (type === 'text' || type === 'password' || type === 'mail') {

        return (
            <div className='interactive-input-ctn'>
                {LabelTag}
                <input placeholder={label} type={type} defaultValue={(!!defaultValue) ? defaultValue : ''} onClick={(e) => e.preventDefault()} onChange={(e) => { showLabel(e); getInfo(objectTag, e.target.value) }} onBlur={(e) => { getInfo(objectTag, e.target.value) }} required ></input>
            </div >
        )
    }
    else if (type === 'sq-select') {

        return (
            <span>
                <h6>{label}</h6>
                <p>{moreInformation}</p>
                <ul className='sq-select-ctn'>
                    {data?.map((item, i) => (

                        <li key={i} className='sq-select-li' >
                            {(!item.includes('Agregar')) ? (
                                <>
                                    <input
                                        className='sq-select-input'
                                        defaultChecked={(item === defaultValue) ? true : false}
                                        id={`${item}-${i}`}
                                        name={`sq-select-${label}`}
                                        type='radio'
                                        value={item}
                                        onClick={(e) => { getInfo(objectTag, item); deselect(e, label) }} />
                                    <label className='sq-select-label' for={`${item}-${i}`}>{item}</label>
                                </>
                            ) : (
                                    <input
                                        className={`sq-select-label ${(classComplete) ? 'classComplete' : ''}`}
                                        // onChange={(e)=>(!!e.target.value)?e.target.classList.add = 'sq-select-input-complete':e.target.classList.remove = 'sq-select-input-complete'}
                                        id={`${item}-${i}`}
                                        name={`sq-select-${label}`}
                                        type='text'
                                        placeholder={`+ Agregar ${label}`}
                                        autoComplete='off'
                                        defaultValue={(location.pathname == '/regions' && defaultValue) ? defaultValue : ''}
                                        onClick={(e) => deselect(e, label)}
                                        onBlur={(e) =>
                                            (!!e.target.value) ? (
                                                getInfo(objectTag, e.target.value),
                                                setClassComplete(true))
                                                : setClassComplete(false)}

                                    />
                                )


                            }


                        </li>
                    ))}
                </ul>
            </span>
        )
    }
}
export default Inputs;