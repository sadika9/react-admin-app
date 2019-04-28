import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {bindMenu, bindTrigger, usePopupState} from 'material-ui-popup-state/hooks';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = theme => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing.unit,
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});

function Header(props) {
  const {classes, user, links, location, onDrawerToggle, onSignOut} = props;

  const popupState = usePopupState({variant: 'popover', popupId: 'user-action-menu'});

  const handleChange = (event, value) => {
    props.history.push(value);
  };

  const handleSignOut = event => {
    popupState.close(event);
    onSignOut();
  };

  let currentRoute = '';
  for (let link of links.children) {
    if (location.pathname.startsWith(link.path)) {
      currentRoute = link.path;
    }
  }

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={8} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon/>
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs/>
            <Grid item>
              <IconButton color="inherit" className={classes.iconButtonAvatar} {...bindTrigger(popupState)}>
                <Avatar className={classes.avatar}>
                  {
                    (user.email) ? user.email[0].toUpperCase() : <PersonIcon/>
                  }
                </Avatar>
              </IconButton>
              <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={8}>
            <Grid item xs>
              <Typography color="inherit" variant="h5">
                {links.label}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Tabs value={currentRoute} onChange={handleChange} textColor="inherit">
          {links.children.map((props, key) => {
            return <Tab textColor="inherit" value={props.path} label={props.label} key={key}/>
          })}
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  links: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
