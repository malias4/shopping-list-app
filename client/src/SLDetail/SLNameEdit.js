import Modal from "react-bootstrap/Modal";

import Form from "react-bootstrap/Form";

function UpdateName({ show, handleClose, data, handlerMap }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const formData = new FormData(e.target);
          const values = Object.fromEntries(formData);
          handlerMap.updateName({ name: values.name });
          handleClose();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit List Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>List Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            defaultValue={data.name}
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="close-buttons" onClick={handleClose}>
            Close
          </button>
          <button className="success-buttons" type="submit">
            Save Changes
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateName;
