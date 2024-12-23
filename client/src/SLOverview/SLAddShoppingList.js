import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function CreateShoppingListForm({ show, handleClose, handlerMap }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData);
    if (handlerMap && handlerMap.handleCreate) {
      handlerMap.handleCreate({ name: values.name });
    }
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Shopping List</DialogTitle>
        <DialogContent>
          <TextField
            label="List Name"
            type="text"
            name="name"
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateShoppingListForm;
