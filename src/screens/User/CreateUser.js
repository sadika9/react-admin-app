import React from 'react';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import UserService from 'services/UserService';
import * as Yup from 'yup';

const styles = theme => ({
  paper: {
    maxWidth: 500,
    margin: 'auto',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing.unit,
  },
  form: {
    marginTop: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    width: 200,
  },
  checkbox: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
  },
  submitButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
});

class CreateUser extends React.Component {
  userSchema = Yup.object().shape({
    email: Yup.string()
      .email('The e-mail must be a valid email address.')
      .required('The e-mail field is required.'),
  });

  constructor(props) {
    super(props);

    this.initialState = {
      email: null,
      smsCredentials: true,
      emailCredentials: true,
      validation: {
        email: null,
      },
      isSubmitting: false,
    };

    this.state = this.initialState;
  }

  handleChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

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

    let data = {
      ...this.state,
      notifyBy: [],
    };

    if (data.smsCredentials) {
      data.notifyBy.push('sms');
    }
    if (data.emailCredentials) {
      data.notifyBy.push('email');
    }

    UserService.createUser(data)
      .then(() => {
        alert('User successfully created');

        this.setState({
          isSubmitting: false,
        });
      })
      .catch(error => {
        const response = error.response;

        if (response.status === 422) {
          this.setServerValidationErrors(response.data.failures);

          this.setState({
            isSubmitting: false,
          });

          return;
        }

        alert('An error occurred while registering the user')
      });
  };

  setServerValidationErrors(failures) {
    let validationErrors = {
      email: null,
    };

    if (failures.hasOwnProperty('email')) {
      validationErrors.email = failures.email.join(', ');
    }

    this.setState({
      validation: validationErrors
    });
  }

  validateForm() {
    let validationErrors = {
      email: null,
    };

    const validationOptions = {
      abortEarly: false
    };

    try {
      this.userSchema.validateSync(this.state, validationOptions);

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
    const {classes} = this.props;
    const {isSubmitting} = this.state;

    return (
      <Paper className={classes.paper}>
        <form className={classes.form} autoComplete="off" onSubmit={this.handleSubmit}>
          <TextField
            id="email"
            name="email"
            label="Email Address"
            fullWidth
            required
            className={classes.textField}
            error={this.hasError('email')}
            value={this.state.email}
            onChange={this.handleChange}
            helperText={this.state.validation.email}
            margin="normal"
          />
          <br />
          <FormControlLabel
            className={classes.checkbox}
            control={<Checkbox
              value="remember"
              color="primary"
              name="emailCredentials"
              checked={this.state.emailCredentials}
              onChange={this.handleChange} />}
            label="Send credentials via E-Mail"
          />
          <br />
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="flex-end"
          >
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={isSubmitting}>
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
  }
}

export default withStyles(styles)(CreateUser);
