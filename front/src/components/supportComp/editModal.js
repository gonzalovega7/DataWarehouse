import { React } from 'react';
import { Modal } from 'react-bootstrap';
import '../css/acciones.css'

function EditModal({ modalStatus, setModalStatus, title, children }) {

    return (
        <Modal show={modalStatus} size="lg" onHide={() => setModalStatus(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Modificar {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>

    );

};
export default EditModal;