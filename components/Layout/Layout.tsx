import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
} from '@material-ui/core';
import useStyles from './styles/styles';

type LayoutProps = {
  children?: any;
  title?: string;
  description?: string;
};

const Layout = ({ title, description, children }: LayoutProps) => {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Magazine` : 'Magazine'}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <AppBar className={classes.navbar} position="static">
        <Toolbar>
          <NextLink href="/" passHref>
            <Link>
              <Typography className={classes.brand}>Magazine</Typography>
            </Link>
          </NextLink>
          <div className={classes.grow}></div>
          <div>
            <NextLink href="/cart" passHref>
              <Link>Cart</Link>
            </NextLink>
            <NextLink href="/login" passHref>
              <Link>Login</Link>
            </NextLink>
          </div>
        </Toolbar>
      </AppBar>
      <Container className={classes.main}>{children}</Container>
      <footer className={classes.footer}>
        <Typography>All rights reserved. Magazine</Typography>
      </footer>
    </div>
  );
};

export default Layout;
