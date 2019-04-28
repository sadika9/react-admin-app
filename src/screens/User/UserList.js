import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import MUIDataTable from 'mui-datatables';

import UserService from 'services/UserService';
import {Link} from 'react-router-dom';

const styles = {};

const columns = [
  {
    name: 'ID',
    options: {
      filter: false,
    }
  },
  {
    name: 'Email',
    options: {
      filter: false,
      customBodyRender: function (value, tableMeta, updateValue) {
        return <Link to={`/users/${tableMeta.rowData[0]}`}>{value}</Link>;
      }
    }
  },
];

const options = {
  filter: false,
  selectableRows: false,
};

class UserList extends React.Component {

  _isMounted = false;

  state = {
    users: [],
  };

  componentDidMount() {
    this._isMounted = true;

    UserService.getUsers()
      .then(response => {

        let users = response.data.data.map(user => {
          return [
            user.id,
            user.email,
          ];
        });

        if (this._isMounted) {
          this.setState({
            data: response.data.data,
            users
          });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <MUIDataTable
        title={"User List"}
        data={this.state.users}
        columns={columns}
        options={options}
      />
    );
  }
}

export default withStyles(styles)(UserList);
