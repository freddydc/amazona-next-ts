import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import NextLink from 'next/link';
import Carousel from 'react-material-ui-carousel';
import { Grid, Link, Typography } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import { StoreContext } from '@utils/store/Store';
import Layout from '@components/Layout/Layout';
import Product from '@models/Product/Product';
import ProductItem from '@components/ProductItem/ProductItem';
import useStyles from '@components/Layout/styles';
import { Products } from '@utils/types';
import db from '@database';
import axios from 'axios';
import { LeanDocument } from 'mongoose';

type ProductProps = {
  topRatedProducts: Products[];
  featuredProducts: Products[];
};

const Home = ({ topRatedProducts, featuredProducts }: ProductProps) => {
  const router = useRouter();
  const classes = useStyles();
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
      <Carousel className={classes.mt_1} animation="slide">
        {featuredProducts.map((product) => (
          <NextLink
            key={product._id}
            href={`/product/${product.slug}`}
            passHref
          >
            <Link>
              <Image
                alt={product.name}
                src={product.featuredImage}
                layout="responsive"
                width="100%"
                height="40%"
              />
            </Link>
          </NextLink>
        ))}
      </Carousel>
      <Typography variant="h2">Popular Products</Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product) => (
          <Grid item md={4} key={product._id}>
            <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  await db.connect();
  const featuredProductsDocs: LeanDocument<Products>[] = await Product.find(
    { isFeatured: true },
    '-reviews'
  )
    .lean()
    .limit(3);

  const topRatedProductsDocs: LeanDocument<Products>[] = await Product.find(
    {},
    '-reviews'
  )
    .lean()
    .sort({
      rating: -1,
    })
    .limit(6);
  await db.disconnect();
  return {
    props: {
      featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
    },
  };
};

export default Home;
