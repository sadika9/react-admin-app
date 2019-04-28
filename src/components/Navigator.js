import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import {Link} from 'react-router-dom';
import logo from 'assets/img/icons8-eye-96.png';

const styles = theme => ({
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: 16,
    paddingBottom: 16,
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.white,
  },
  itemActionable: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
    '&$textDense': {
      fontSize: theme.typography.fontSize,
    },
  },
  textDense: {},
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
  logo: {
    width: "24px",
    marginRight: "10px",
  },
  navLink: {
    textDecoration: "none"
  }
});

function Navigator(props) {
  const {classes, links, location, ...other} = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={classNames(classes.firebase, classes.item, classes.itemCategory)}>
          <img src={logo} alt="logo" className={classes.logo} />
          Console
        </ListItem>
        <Link
          className={classes.navLink}
          to="/dashboard"
        >
          <ListItem className={classNames(classes.item, classes.itemCategory)}>
            <ListItemIcon>
              <HomeIcon/>
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
            >
              Overview
            </ListItemText>
          </ListItem>
        </Link>
        {links.map(({label, children}) => (
          <React.Fragment key={label}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {label}
              </ListItemText>
            </ListItem>
            {children.map(({label: childLabel, path, icon}) => (
              <Link
                className={classes.navLink}
                key={childLabel}
                to={path}
              >
                <ListItem
                  button
                  dense
                  className={classNames(
                    classes.item,
                    classes.itemActionable,
                    location.pathname.startsWith(path) && classes.itemActiveItem,
                  )}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                      textDense: classes.textDense,
                    }}
                  >
                    {childLabel}
                  </ListItemText>
                </ListItem>
              </Link>
            ))}
            <Divider className={classes.divider}/>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
  links: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
