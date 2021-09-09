import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { StoreContext } from '@utils/store/Store';

const Shipping = () => {
  const router = useRouter();
  const { state } = useContext(StoreContext);
  const { userInfo } = state;
  if (!userInfo) {
    router.push('/login?redirect=/shipping');
  }
  return <div>Shipping Page</div>;
};

export default Shipping;
