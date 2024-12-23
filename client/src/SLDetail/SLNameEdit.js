import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function UpdateName({ show, handleClose, data, handlerMap }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData);
    handlerMap.updateName({ name: values.name });
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit List Name</DialogTitle>
        <DialogContent>
          <TextField
            label="List Name"
            type="text"
            name="name"
            defaultValue={data.listName}
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
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UpdateName;
