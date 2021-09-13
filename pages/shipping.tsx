import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@components/Layout/Layout';
import useStyles from '@components/Layout/styles';
import {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { Address } from '@utils/types';
import CheckoutWizard from '@components/Checkout/CheckoutWizard';
import { Controller, useForm } from 'react-hook-form';
import { StoreContext } from '@utils/store/Store';
import Cookies from 'js-cookie';

const Shipping = () => {
  const router = useRouter();
  const classes = useStyles();
  const { state, dispatch } = useContext(StoreContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
    setValue('fullName', shippingAddress.fullName || '');
    setValue('address', shippingAddress.address || '');
    setValue('city', shippingAddress.city || '');
    setValue('postalCode', shippingAddress.postalCode || '');
    setValue('country', shippingAddress.country || '');
  }, []);

  const submitHandler = ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }: Address) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    router.push('/payment');
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  id="fullName"
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Full name must be at least 2 characters.'
                        : 'Enter your full name'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  id="address"
                  label="Address"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'minLength'
                        ? 'Address must be at least 2 characters.'
                        : 'Enter your address'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="city"
              control={control}
              defaultValue=""
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  id="city"
                  label="City"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'City must be at least 2 characters.'
                        : 'Enter your city'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="postalCode"
              control={control}
              defaultValue=""
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  id="postalCode"
                  label="Postal Code"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'minLength'
                        ? 'Postal code must be at least 2 characters.'
                        : 'Enter your postal code'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="country"
              control={control}
              defaultValue=""
              rules={{ required: true, minLength: 2 }}
              render={({ field }) => (
                <TextField
                  id="country"
                  label="Country"
                  fullWidth
                  variant="outlined"
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'Country must be at least 2 characters.'
                        : 'Enter your country'
                      : ''
                  }
                  {...field}
                />
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Shipping;
