import React, { ReactNode, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  AppBar,
  Badge,
  Button,
  Box,
  Drawer,
  Divider,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Container,
  Link,
  List,
  ListItem,
  ListItemText,
  createTheme,
  Switch,
  ThemeProvider,
  CssBaseline,
  IconButton,
} from '@material-ui/core';
import { StoreContext } from '@utils/store/Store';
import MenuIcon from '@material-ui/icons/Menu';
import CancelIcon from '@material-ui/icons/Cancel';
import { GError } from '@utils/types';
import { getError } from '@utils/error';
import { useSnackbar } from 'notistack';
import useStyles from './styles';
import Cookies from 'js-cookie';
import axios from 'axios';

type LayoutProps = {
  title?: string;
  children: ReactNode | any;
  description?: string;
};

const Layout = ({ title, description, children }: LayoutProps) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null as any);
  const { state, dispatch } = useContext(StoreContext);
  const { darkMode, cart, userInfo } = state;
  const classes = useStyles();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [categories, setCategories] = useState([]);

  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/products/categories');
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err as GError), { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  const darkModeChangeHandler = () => {
    dispatch({
      type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON',
      payload: '',
    });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const loginClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (
    e: React.MouseEvent<HTMLLIElement>,
    redirect: string
  ) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT', payload: '' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Magazine` : 'Magazine'}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar className={classes.navbar} position="static">
          <Toolbar className={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
              >
                <MenuIcon className={classes.navbarButton} />
              </IconButton>
              <NextLink href="/" passHref>
                <Link>
                  <Typography className={classes.brand}>magazine</Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor="left"
              open={sidebarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography>Shopping by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category} />
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <div className={classes.grow}></div>
            <div>
              <Switch checked={darkMode} onChange={darkModeChangeHandler} />
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color="secondary"
                        badgeContent={cart.cartItems.length}
                      >
                        Cart
                      </Badge>
                    ) : (
                      'Cart'
                    )}
                  </Typography>
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order_history')
                      }
                    >
                      Order history
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Admin dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>
                    <Typography component="span">Login</Typography>
                  </Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Magazine</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
