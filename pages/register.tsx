import React, { useContext, useEffect } from 'react';
import Layout from '@components/Layout/Layout';
import useStyles from '@components/Layout/styles';
import { Controller, useForm } from 'react-hook-form';
import { StoreContext } from '@utils/store/Store';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { Users } from '@utils/types';

const Register = () => {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(StoreContext);
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const submitHandler = async ({
    name,
    email,
    password,
    confirmPassword,
  }: Users & { confirmPassword: string }) => {
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar(`Passwords don't match`, { variant: 'error' });
      return;
    }
    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      router.push((redirect as string) || '/');
    } catch (err: any) {
      enqueueSnackbar(
        err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message,
        { variant: 'error' }
      );
    }
  };

  return (
    <Layout title="Register">
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
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
                />
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
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: true, minLength: 6 }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password must be at least 6 characters.'
                        : 'Enter your password'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{ required: true, minLength: 6 }}
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
                      ? errors.confirmPassword.type === 'minLength'
                        ? 'Password must be at least 6 characters.'
                        : 'Type your confirm password'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account? &nbsp;
            <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Register;
