

import { VscLoading } from 'react-icons/vsc';
import { FiCheckSquare } from 'react-icons/fi';
import '../css/button.css'

function Button({ fetchStatus, disabledParam,tagName }) {
    return (

        <button className={`generic-button align-right ${(fetchStatus === true) ? 'submit-ok-btn' : (fetchStatus === false) ? 'submit-err-btn' : null}`} type="submit" disabled={disabledParam} >
            {(fetchStatus === null) ? tagName : (fetchStatus === 'fetching') ? <VscLoading className='loading' /> : (fetchStatus) ? <FiCheckSquare className='submit-ok' /> : 'ERROR'}
        </button>

    )
}

export default Button;