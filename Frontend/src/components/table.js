import { useLocation } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import TableRows from './TableRows';


function TableComp({ info, displayEditContacts, children }) {

    const location = useLocation();
    return (
        <div>
            <Table striped bordered hover id='tabla'>
                <thead>
                    <tr>
                        {children}
                    </tr>
                </thead>
                <tbody>
                    {info?.map((data, key) => (
                        <TableRows key={key} data={data} where={location.pathname} displayEditContacts={displayEditContacts} />
                    ))}
                </tbody>
            </Table>
        </div>
    )
}
export default TableComp;