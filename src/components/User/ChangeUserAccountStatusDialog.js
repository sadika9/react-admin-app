import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({});

function ChangeUserAccountStatusDialog(props) {
  const {classes, open, onClose, onConfirm} = props;

  const [accountStatus, setAccountStatus] = useState('active');

  function handleConfirm() {
    onConfirm(accountStatus);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Change user account status?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Select new account status.
        </DialogContentText>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="account-status">Status</InputLabel>
          <Select
            id="account-status"
            value={accountStatus}
            onChange={(event) => setAccountStatus(event.target.value)}
          >
            <MenuItem value={'active'}>Active</MenuItem>
            <MenuItem value={'suspended'}>Suspended</MenuItem>
          </Select>
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Change
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ChangeUserAccountStatusDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChangeUserAccountStatusDialog);
