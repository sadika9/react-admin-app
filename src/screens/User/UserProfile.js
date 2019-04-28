import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import UserService from 'services/UserService';
import PasswordResetConfirmationDialog from 'components/User/PasswordResetConfirmationDialog';
import UserDetailsCard from 'components/User/UserDetailsCard';
import ChangeUserAccountStatusDialog from 'components/User/ChangeUserAccountStatusDialog';

const styles = theme => ({});

class UserProfile extends React.Component {

  _isMounted = false;

  state = {
    passwordResetDialog: {
      open: false,
    },
    userAccountStatusDialog: {
      open: false,
    },
    user: {
      id: this.props.match.params.id,
      email: '',
      userAccountStatus: '',
    },
  };

  componentDidMount() {
    this._isMounted = true;

    this.fetchUserProfile();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchUserProfile = () => {
    UserService.getUserById(this.props.match.params.id, ['user_account_status'])
      .then(response => {
        if (this._isMounted) {
          this.setState({
            user: {
              id: response.data.data.id,
              email: response.data.data.email,
              userAccountStatus: response.data.data.user_account_status.data.type,
            },
          });
        }
      });
  };

  changeUserAccountStatusAction = () => {
    this.setState((prevState) => ({
      userAccountStatusDialog: {
        ...prevState.userAccountStatusDialog,
        open: true,
      }
    }));
  };

  handleChangeUserAccountStatusDialogConfirm = (status) => {
    this.setState((prevState) => ({
      userAccountStatusDialog: {
        ...prevState.userAccountStatusDialog,
        open: false,
      }
    }));

    UserService.changeAccountStatus(this.state.user.id, status)
      .then(response => {
        this.fetchUserProfile();
        alert(response.data.message);
      })
      .catch(error => {
        alert(error.response.data.message);
      });
  };

  handleChangeUserAccountStatusDialogClose = () => {
    this.setState((prevState) => ({
      userAccountStatusDialog: {
        ...prevState.userAccountStatusDialog,
        open: false,
      }
    }));
  };

  confirmPasswordResetAction = () => {
    this.setState((prevState) => ({
      passwordResetDialog: {
        ...prevState.passwordResetDialog,
        open: true,
      }
    }));
  };

  handlePasswordResetDialogConfirm = (smsCredentials, emailCredentials) => {
    this.setState((prevState) => ({
      passwordResetDialog: {
        ...prevState.passwordResetDialog,
        open: false,
      }
    }));

    let notifyBy = [];
    if (smsCredentials) {
      notifyBy.push('sms');
    }
    if (emailCredentials) {
      notifyBy.push('email');
    }

    UserService.resetPassword(this.state.user.id, notifyBy)
      .then(response => {
        alert(response.data.message);
      })
      .catch(error => {
        const response = error.response;

        alert(response.data.message);
      });
  };

  handlePasswordResetDialogClose = () => {
    this.setState((prevState) => ({
      passwordResetDialog: {
        ...prevState.passwordResetDialog,
        open: false,
      }
    }));
  };

  render() {
    const {passwordResetDialog} = this.state;

    return (
      <>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={24}>
          <Grid item>
            <UserDetailsCard
              user={this.state.user}
              onChangeUserAccountStatusAction={this.changeUserAccountStatusAction}
              onConfirmPasswordResetAction={this.confirmPasswordResetAction}
            />
          </Grid>
        </Grid>
        <PasswordResetConfirmationDialog
          open={passwordResetDialog.open}
          onClose={this.handlePasswordResetDialogClose}
          onConfirm={this.handlePasswordResetDialogConfirm}
        />
        <ChangeUserAccountStatusDialog
          open={this.state.userAccountStatusDialog.open}
          onClose={this.handleChangeUserAccountStatusDialogClose}
          onConfirm={this.handleChangeUserAccountStatusDialogConfirm}
        />
      </>
    );
  }
}

export default withStyles(styles)(UserProfile);
