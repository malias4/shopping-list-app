import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function CreateShoppingListForm({ show, handleClose, handlerMap }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const formData = new FormData(e.target);
          const values = Object.fromEntries(formData);
          if (handlerMap && handlerMap.createShoppingList) {
            handlerMap.createShoppingList(values.name);
          }
          handleClose();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Shopping List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>List Name</Form.Label>
          <Form.Control type="text" maxLength={100} name="name" required />
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="close-buttons" onClick={handleClose}>
            Close
          </button>
          <button className="success-buttons" type="submit">
            Create
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateShoppingListForm;
