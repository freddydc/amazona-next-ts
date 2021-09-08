import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next';
import { StoreContext } from '@utils/store/Store';
import Layout from '@components/Layout/Layout';
import Product from '@models/Product/Product';
import { Products } from '@utils/types';
import db from '@database';
import axios from 'axios';

const Home = (props: { products: Products[] }) => {
  const router = useRouter();
  const { products } = props;
  const { state, dispatch } = useContext(StoreContext);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (product: Products) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product._id}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add To Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  await db.connect();
  const products: Products[] = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
};

export default Home;
