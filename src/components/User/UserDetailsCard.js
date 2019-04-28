import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  card: {
    minWidth: 500,
  },
  title: {
    fontSize: 14,
  },
});

function UserDetailsCard(props) {
  const {classes, user, onChangeUserAccountStatusAction, onConfirmPasswordResetAction} = props;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textPrimary" gutterBottom>
          User information
        </Typography>
        <Table padding="dense">
          <TableBody>
            <TableRow>
              <TableCell>E-Mail</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>User Account Status</TableCell>
              <TableCell>
                {user.userAccountStatus}
                <IconButton
                  color="primary"
                  className={classes.button}
                  aria-label="Change user account status"
                  onClick={onChangeUserAccountStatusAction}
                >
                  <EditIcon fontSize="small"/>
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="center"
          spacing={8}
        >
          <Grid item>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="primary" onClick={onConfirmPasswordResetAction}>
              Reset Password
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

UserDetailsCard.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onChangeUserAccountStatusAction: PropTypes.func.isRequired,
  onConfirmPasswordResetAction: PropTypes.func.isRequired,
};

export default withStyles(styles)(UserDetailsCard);
