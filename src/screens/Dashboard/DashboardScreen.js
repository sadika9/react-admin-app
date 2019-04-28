import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class DashboardScreen extends React.Component {

  _isMounted = false;

  state = {};

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
        </Grid>
      </div>
    );
  }
}

DashboardScreen.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DashboardScreen);
