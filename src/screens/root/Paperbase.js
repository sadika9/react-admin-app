import React from 'react';
import PropTypes from 'prop-types';
import {MuiThemeProvider, createMuiTheme, withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Navigator from 'components/Navigator';
import Header from 'components/Header';
import PageNotFound from "components/PageNotFound";
import {Switch, Route, Redirect} from "react-router-dom";
import {dashboardRoutes, navigatorLinks, headerLinks} from './helpers/dashboardRoutes';
import AuthService from 'services/AuthService';
import ProfileService from 'services/ProfileService';

let theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#18202c',
      },
    },
    MuiButton: {
      label: {
        textTransform: 'initial',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing.unit,
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: 'initial',
        margin: '0 16px',
        minWidth: 0,
        [theme.breakpoints.up('md')]: {
          minWidth: 0,
        },
      },
      labelContainer: {
        padding: 0,
        [theme.breakpoints.up('md')]: {
          padding: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing.unit,
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854',
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: 48,
    },
  },
};

const drawerWidth = 256;

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: '48px 36px 0',
    background: '#eaeff1',
  },
};

class Paperbase extends React.Component {
  _isMounted = false;

  state = {
    mobileOpen: false,
    user: {
      id: null,
      email: null,
    },
  };

  componentDidMount() {
    this._isMounted = true;

    this.fetchProfile();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleDrawerToggle = () => {
    this.setState(state => ({mobileOpen: !state.mobileOpen}));
  };

  handleSignOut = () => {
    AuthService.signOut()
      .then(() => {
        this.props.history.push('/auth/sign_in');
      });
  };

  getHeaderLinks() {
    const pathname = this.props.location.pathname;

    for (let item of headerLinks) {
      if (pathname.startsWith(item.group)) {
        return item;
      }
    }

    return {
      label: '',
      children: [],

    };
  }

  fetchProfile = () => {
    ProfileService.getProfile()
      .then(response => {
        if (this._isMounted) {
          this.setState({
            user: {
              id: response.data.data.id,
              email: response.data.data.email,
            },
          });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            user: {
              id: null,
              email: null,
            },
          });
        }
      });
  };

  render() {
    const {classes} = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline/>
          <nav className={classes.drawer}>
            <Hidden smUp implementation="js">
              <Navigator
                PaperProps={{style: {width: drawerWidth}}}
                variant="temporary"
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                links={navigatorLinks}
                location={this.props.location}
              />
            </Hidden>
            <Hidden xsDown implementation="css">
              <Navigator
                PaperProps={{style: {width: drawerWidth}}}
                links={navigatorLinks}
                location={this.props.location}
              />
            </Hidden>
          </nav>
          <div className={classes.appContent}>
            <Header
              user={this.state.user}
              onDrawerToggle={this.handleDrawerToggle}
              links={this.getHeaderLinks()}
              location={this.props.location}
              history={this.props.history}
              onSignOut={this.handleSignOut}
            />
            <main className={classes.mainContent}>
              <Switch>
                {dashboardRoutes.map((prop, key) => {
                  if (prop.redirect) {
                    return <Redirect from={prop.path} to={prop.to} exact={prop.exact} key={key}/>;
                  }
                  return <Route path={prop.path} component={prop.component} key={key}/>;
                })}
                <Route component={PageNotFound}/>
              </Switch>
            </main>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Paperbase.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Paperbase);
