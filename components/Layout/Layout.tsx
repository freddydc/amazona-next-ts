import React from 'react';
import Head from 'next/head';
import { AppBar, Toolbar, Typography, Container } from '@material-ui/core';

type LayoutProps = {
  children?: any;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Head>
        <title>Magazine</title>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography>Magazine</Typography>
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
      <footer>
        <Typography>All rights reserved. Magazine</Typography>
      </footer>
    </div>
  );
};

export default Layout;
