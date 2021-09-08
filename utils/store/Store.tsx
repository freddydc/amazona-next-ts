import React, { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { CartAction, CartState, Products as Items } from '@utils/types';
import Cookies from 'js-cookie';

type Context = {
  state: CartState;
  dispatch: Dispatch<CartAction>;
};

const context = {} as Context;
export const StoreContext = createContext(context);

const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(`${Cookies.get('cartItems')}`)
      : [],
  },
};

function reducer(state: CartState, action: CartAction) {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item: Items) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item: Items) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
}

const StoreProvider = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
