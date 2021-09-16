import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { StoreContext } from '@utils/store/Store';
import { useSnackbar } from 'notistack';
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import useStyles from '@components/Layout/styles';
import Layout from '@components/Layout/Layout';
import { getError } from '@utils/error';
import { GError, User } from '@utils/types';
import Cookies from 'js-cookie';
import axios from 'axios';

const Profile = () => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(StoreContext);
  const { userInfo } = state;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
  }, []);

  const submitHandler = async ({
    name,
    email,
    password,
    confirmPassword,
  }: User) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar(`Passwords don't match`, { variant: 'error' });
      return;
    }
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      enqueueSnackbar('Profile Updated Successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getError(err as GError), { variant: 'error' });
    }
  };

  return (
    <Layout title="Profile">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="User Profile" />
                </ListItem>
              </NextLink>
              <NextLink href="/order_history" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Order History" />
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
                  Profile
                </Typography>
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
                        rules={{ required: true, minLength: 2 }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            inputProps={{ type: 'text' }}
                            error={Boolean(errors.name)}
                            helperText={
                              errors.name
                                ? errors.name.type === 'minLength'
                                  ? 'Name must be at least 2 characters.'
                                  : 'Enter your name'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="email"
                            label="Email"
                            inputProps={{ type: 'email' }}
                            error={Boolean(errors.email)}
                            helperText={
                              errors.email
                                ? errors.email.type === 'pattern'
                                  ? 'Enter a valid email address'
                                  : 'Enter your email'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Password must be at least 6 characters.',
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="password"
                            label="Password"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.password)}
                            helperText={
                              errors.password ? errors.password.message : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) =>
                            value === '' ||
                            value.length > 5 ||
                            'Confirm password must be at least 6 characters.',
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={
                              errors.confirmPassword
                                ? errors.confirmPassword.message
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Update
                      </Button>
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

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
