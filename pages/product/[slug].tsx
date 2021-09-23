import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { Products } from '@utils/types';
import Layout from '@components/Layout/Layout';
import useStyles from '@components/Layout/styles';
import Product from '@models/Product/Product';
import { StoreContext } from '@utils/store/Store';
import Rating from '@material-ui/lab/Rating';
import { useSnackbar } from 'notistack';
import { getError } from '@utils/error';
import { GError, ItemReview } from '@utils/types';
import db from '@database';
import axios from 'axios';

const ProductScreen = (props: { product: Products }) => {
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { product } = props;
  const { state, dispatch } = useContext(StoreContext);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  const [reviews, setReviews] = useState([] as ItemReview[]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      setLoading(false);
      enqueueSnackbar('Review submitted successfully', { variant: 'success' });
      fetchReviews();
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err as GError), { variant: 'error' });
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data as ItemReview[]);
    } catch (err) {
      enqueueSnackbar(getError(err as GError), { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = async () => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock <= quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>Back To Products</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width="100%"
            height="70%"
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Rating value={product.rating} readOnly />
              <Link href="#reviews">
                <Typography>({product.numReviews} Reviews)</Typography>
              </Link>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In Stock' : 'Unavailable'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
      <List>
        <ListItem>
          <Typography id="reviews" variant="h2">
            Customer Reviews
          </Typography>
        </ListItem>
        {reviews.length === 0 && <ListItem>No reviews</ListItem>}
        {reviews.map((review) => (
          <ListItem key={review._id}>
            <Grid container>
              <Grid item className={classes.reviewItem}>
                <Typography>
                  <strong>{review.name}</strong>
                </Typography>
                <Typography>{review.createdAt?.substring(0, 10)}</Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly />
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {userInfo ? (
            <form className={classes.reviewForm} onSubmit={submitHandler}>
              <List>
                <ListItem>
                  <Typography variant="h2">Leave your review</Typography>
                </ListItem>
                <ListItem>
                  <TextField
                    label="Enter comment"
                    variant="outlined"
                    fullWidth
                    name="comment"
                    multiline
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e: any) => setRating(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                  >
                    Submit
                  </Button>
                  {loading && <CircularProgress />}
                </ListItem>
              </List>
            </form>
          ) : (
            <Typography variant="h2">
              Please{' '}
              <Link href={`/login?redirect=/product/${product.slug}`}>
                login
              </Link>{' '}
              to write a review
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const slug = params?.slug as string;
  await db.connect();
  const product = await Product.findOne({ slug }, '-reviews').lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
};

export default ProductScreen;
