import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { StoreContext } from '@utils/store/Store';
import Layout from '@components/Layout/Layout';
import { Controller, useForm } from 'react-hook-form';
import useStyles from '@components/Layout/styles';
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
import { Users } from '@utils/types';
import axios from 'axios';

const Login = () => {
  const classes = useStyles();
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(StoreContext);
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
  }, [router, userInfo]);

  const submitHandler = async ({ email, password }: Users) => {
    closeSnackbar();
    try {
      const { data } = await axios.post('/api/users/login', {
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
    <Layout title="Login">
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
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
                  id="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
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
                  id="password"
                  label="Password"
                  fullWidth
                  variant="outlined"
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
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Login
            </Button>
          </ListItem>
          <ListItem>
            New customer? &nbsp;
            <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
              <Link>Create your account</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Login;
