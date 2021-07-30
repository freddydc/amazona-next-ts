import React from 'react';
import Head from 'next/head';
import { AppBar, Toolbar, Typography, Container } from '@material-ui/core';
import useStyles from '../../utils/styles';

type LayoutProps = {
  children?: any;
};

const Layout = ({ children }: LayoutProps) => {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>Magazine</title>
      </Head>
      <AppBar className={classes.navbar} position="static">
        <Toolbar>
          <Typography>Magazine</Typography>
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
