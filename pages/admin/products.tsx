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
import { GError, Products } from '@utils/types';
import axios from 'axios';

type State = {
  loading: boolean;
  products: Products[];
  error: string;
};

type Action = {
  type: string;
  payload?: Products[] | string;
};

function productReducer(state: State, action: Action) {
  switch (action.type) {
    case 'PRODUCTS_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'PRODUCTS_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload as Products[],
        error: '',
      };
    case 'PRODUCTS_FAIL':
      return { ...state, loading: false, error: action.payload as string };
    default:
      return state;
  }
}

const ProductDashboard = () => {
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(StoreContext);
  const { userInfo } = state;

  const initialState = {
    loading: true,
    products: [] as Products[],
    error: '',
  };

  const [{ loading, error, products }, dispatch] = useReducer(
    productReducer,
    initialState
  );

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchProducts = async () => {
      try {
        dispatch({ type: 'PRODUCTS_REQUEST' });
        const { data } = await axios.get('/api/admin/products', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'PRODUCTS_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'PRODUCTS_FAIL', payload: getError(err as GError) });
      }
    };
    fetchProducts();
  }, []);

  return (
    <Layout title="Products">
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
                <ListItem selected button component="a">
                  <ListItemText primary="Products" />
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
                  Products
                </Typography>
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
                          <TableCell>Id</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Count</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              {product._id.substring(18, 24)}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/product/${product._id}`}
                                passHref
                              >
                                <Button size="small" variant="contained">
                                  Edit
                                </Button>
                              </NextLink>{' '}
                              <Button size="small" variant="contained">
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

export default dynamic(() => Promise.resolve(ProductDashboard), { ssr: false });
