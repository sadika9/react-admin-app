import React from 'react';
import {CreateUser, UserProfile, UserList} from 'screens/User';
import DashboardScreen from 'screens/Dashboard/DashboardScreen';
import PeopleIcon from '@material-ui/icons/People';

export const dashboardRoutes = [
  {path: '/dashboard', component: DashboardScreen},

  {path: '/users/create', component: CreateUser},
  {path: '/users/:id', component: UserProfile},
  {path: '/users', component: UserList},

  {path: '', to: '/dashboard', exact: true, redirect: true},
];

export const navigatorLinks = [
  {
    label: 'Accounts',
    children: [
      {path: '/users', label: 'Users', icon: <PeopleIcon/>},
    ],
  },
];

export const headerLinks = [
  {
    group: '/dashboard',
    label: 'Dashboard',
    children: []
  },
  {
    group: '/users',
    label: 'Users',
    children: [
      {path: '/users', label: 'Users'},
      {path: '/users/create', label: 'Register'},
    ]
  },
];
