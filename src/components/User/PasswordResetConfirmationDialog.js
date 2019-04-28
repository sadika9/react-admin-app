import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({});

function PasswordResetConfirmationDialog(props) {
  const [smsCredentials, setSmsCredentials] = useState(true);
  const [emailCredentials, setEmailCredentials] = useState(true);

  const {classes, open, onClose, onConfirm} = props;

  function handleConfirm() {
    if (smsCredentials === false && emailCredentials === false) {
      alert("Error at least one password notification method should be selected.");

      return
    }

    onConfirm(smsCredentials, emailCredentials);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Reset user's password?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to reset the password?
        </DialogContentText>
        <Grid container direction="column">
          <Grid item>
            <FormControlLabel
              className={classes.checkbox}
              control={<Checkbox
                color="primary"
                checked={smsCredentials}
                onChange={(event, checked) => setSmsCredentials(checked)}/>}
              label="Send credentials via SMS"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              className={classes.checkbox}
              control={<Checkbox
                color="primary"
                checked={emailCredentials}
                onChange={(event, checked) => setEmailCredentials(checked)}/>}
              label="Send credentials via E-Mail"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PasswordResetConfirmationDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default withStyles(styles)(PasswordResetConfirmationDialog);
