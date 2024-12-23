import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

function AddMemberForm({ show, handleClose, userList, handlerMap }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData);
    handlerMap.addMember({ memberId: values.memberId });
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Member</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Member"
            name="memberId"
            fullWidth
            required
            margin="normal"
            defaultValue=""
          >
            {userList.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
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

export default AddMemberForm;
