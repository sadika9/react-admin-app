import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import {Redirect} from 'react-router-dom';
import * as Yup from 'yup';

import AuthService from 'services/AuthService';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class SignInScreen extends React.Component {

  state = {
    redirectToReferrer: false,
    isSubmitting: false,
  };

  signInSchema = Yup.object().shape({
    email: Yup.string()
      .email('The e-mail must be a valid email address.')
      .required('The e-mail field is required.'),
    password: Yup.string()
      .required('The password field is required.'),
  });

  constructor(props) {
    super(props);

    this.initialState = {
      email: '',
      password: '',
      validation: {
        email: null,
        password: null,
      }
    };

    this.state = this.initialState;
  }

  handleChange = event => {
    const {name, value} = event.target;

    this.setState({
      [name]: value
    });
  };

  hasError = field => {
    return this.state.validation[field] != null;
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (! this.validateForm()) {
      return;
    }

    this.setState({
      isSubmitting: true,
    });

    AuthService.signIn(this.state.email, this.state.password)
      .then(() => {
        this.setState({
          redirectToReferrer: true,
          isSubmitting: false,
        });
      })
      .catch(error => {
        const response = error.response;
        if (response.status === 401) {
          this.setServerValidationErrors(response.data.failures);
          this.setState({
            isSubmitting: false,
          });

          return;
        }

        alert('Unknown error occurred');
      });
  };

  setServerValidationErrors(failures) {
    let validationErrors = {
      email: null,
      password: null,
    };

    if (failures.hasOwnProperty('username')) {
      validationErrors.email = failures.username;
    }

    if (failures.hasOwnProperty('password')) {
      validationErrors.password = failures.password;
    }

    this.setState({
      validation: validationErrors
    });
  }

  validateForm() {
    let validationErrors = {
      email: null,
      password: null,
    };

    const validationOptions = {
      abortEarly: false
    };

    try {
      this.signInSchema.validateSync(this.state, validationOptions);

      return true;
    } catch (e) {
      if (e.name !== 'ValidationError') {
        alert('Unknown error occurred while validating the inputs');

        return false;
      }

      for (let index in e.inner) {
        const key = e.inner[index].path;

        validationErrors[key] = e.errors[index];
      }

      this.setState({
        validation: validationErrors
      });

      return false;
    }
  }

  render() {
    const { classes } = this.props;

    let { from } = this.props.location.state || { from: { pathname: '/' } };
    let { redirectToReferrer, isSubmitting } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <TextField
              required
              label="Email Address"
              fullWidth
              autoFocus
              name="email"
              autoComplete="email"
              error={this.hasError('email')}
              value={this.state.email}
              onChange={this.handleChange}
              margin="normal"
              helperText={this.state.validation.email}
            />
            <TextField
              required
              label="Password"
              fullWidth
              name="password"
              type="password"
              autoComplete="current-password"
              error={this.hasError('password')}
              value={this.state.password}
              onChange={this.handleChange}
              margin="normal"
              helperText={this.state.validation.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isSubmitting}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

SignInScreen.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignInScreen);
