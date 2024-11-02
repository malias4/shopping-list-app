import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function AddMemberForm({ show, handleClose, userList, handlerMap }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const formData = new FormData(e.target);
          const values = Object.fromEntries(formData);
          handlerMap.addMember({ memberId: values.memberId });
          handleClose();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Member</Form.Label>
          <Form.Select type="select" name="memberId" required>
            {userList.map((user) => {
              return (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              );
            })}
          </Form.Select>
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

export default AddMemberForm;
