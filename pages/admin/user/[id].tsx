import React, { useContext, useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import useStyles from '@components/Layout/styles';
import Layout from '@components/Layout/Layout';
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import { getError } from '@utils/error';
import { Controller, useForm } from 'react-hook-form';
import type { GetServerSideProps } from 'next';
import { StoreContext } from '@utils/store/Store';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { GError } from '@utils/types';

type State = {
  loading: boolean;
  error: string;
  loadingUpdate?: boolean;
};

type Action = {
  type: string;
  payload?: string;
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'FETCH_USER_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_USER_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_USER_FAIL':
      return { ...state, loading: false, error: action.payload as string };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    default:
      return state;
  }
}

const UserEdit = ({ params }: { params: { id: string } }) => {
  const userId = params.id;
  const classes = useStyles();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state } = useContext(StoreContext);
  const { userInfo } = state;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const initialState = {
    loading: true,
    error: '',
  };

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_USER_REQUEST' });
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setIsAdmin(data.isAdmin);
          dispatch({ type: 'FETCH_USER_SUCCESS' });
          setValue('name', data.name);
        } catch (err) {
          dispatch({
            type: 'FETCH_USER_FAIL',
            payload: getError(err as GError),
          });
        }
      };
      fetchData();
    }
  }, []);

  const submitHandler = async ({ name }: { name: string }) => {
    closeSnackbar();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('User uploaded successfully', { variant: 'success' });
      router.push('/admin/users');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err as GError) });
      enqueueSnackbar(getError(err as GError), { variant: 'error' });
    }
  };

  return (
    <Layout title={`Edit User ${userId.substring(18, 24)}`}>
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
                  Edit User {userId.substring(18, 24)}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress />}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
              </ListItem>
              <ListItem>
                <form
                  className={classes.form}
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            id="name"
                            label="Name"
                            fullWidth
                            error={Boolean(errors.name)}
                            helperText={errors.name ? 'Enter user name' : ''}
                            {...field}
                          />
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <FormControlLabel
                        label="Is Admin"
                        control={
                          <Checkbox
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement> & {
                                target: { checked: boolean };
                              }
                            ) => setIsAdmin(e.target.checked)}
                            checked={isAdmin}
                            name="isAdmin"
                          />
                        }
                      ></FormControlLabel>
                    </ListItem>
                    <ListItem>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                      >
                        Update
                      </Button>
                      {loadingUpdate && <CircularProgress />}
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      params,
    },
  };
};

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
