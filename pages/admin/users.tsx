import React, { useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import useStyles from '@components/Layout/styles';
import Layout from '@components/Layout/Layout';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { getError } from '@utils/error';
import { StoreContext } from '@utils/store/Store';
import { GError, Users } from '@utils/types';
import { useSnackbar } from 'notistack';
import axios from 'axios';

type State = {
  loading: boolean;
  users: Users[];
  error: string;
  successDelete?: boolean;
  loadingDelete?: boolean;
};

type Action = {
  type: string;
  payload?: Users[] | string;
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'FETCH_USERS_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        loading: false,
        users: action.payload as Users[],
        error: '',
      };
    case 'FETCH_USERS_FAIL':
      return { ...state, loading: false, error: action.payload as string };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}

const AdminUsers = () => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { state } = useContext(StoreContext);
  const { userInfo } = state;

  const initialState = {
    loading: true,
    users: [] as Users[],
    error: '',
  };

  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchUsers = async () => {
      try {
        dispatch({ type: 'FETCH_USERS_REQUEST' });
        const { data } = await axios.get('/api/admin/users', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_USERS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_USERS_FAIL',
          payload: getError(err as GError),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchUsers();
    }
  }, [successDelete]);

  const deleteHandler = async (userId: string) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err as GError), { variant: 'error' });
    }
  };

  return (
    <Layout title="Users">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Users" />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Users
                </Typography>
                {loadingDelete && <CircularProgress />}
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>EMAIL</TableCell>
                          <TableCell>ADMIN</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user._id.substring(18, 24)}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/user/${user._id}`}
                                passHref
                              >
                                <Button size="small" variant="contained">
                                  Edit
                                </Button>
                              </NextLink>{' '}
                              <Button
                                onClick={() => deleteHandler(user._id)}
                                variant="contained"
                                size="small"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });
