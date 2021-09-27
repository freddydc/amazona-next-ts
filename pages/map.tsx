import React, { useState, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useStyles from '@components/Layout/styles';
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import { Button } from '@material-ui/core';
import { StoreContext } from '@utils/store/Store';
import { CircularProgress } from '@material-ui/core';
import { GError } from '@utils/types';
import { getError } from '@utils/error';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const defaultLocation = { lat: 45.516, lng: -73.56 };
const libs = ['places'] as any;

const Map = () => {
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(StoreContext);
  const { userInfo } = state;
  const [googleApiKey, setGoogleApiKey] = useState('');

  useEffect(() => {
    const fetchGoogleApiKey = async () => {
      try {
        const { data } = await axios.get('/api/keys/google', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setGoogleApiKey(data);
        getUserCurrentLocation();
      } catch (err) {
        enqueueSnackbar(getError(err as GError), { variant: 'error' });
      }
    };
    fetchGoogleApiKey();
  }, []);

  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      enqueueSnackbar('Geolocation is not supported', {
        variant: 'error',
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  const defaultRef = null as any;
  const mapRef = useRef(defaultRef);
  const placeRef = useRef(defaultRef);
  const markerRef = useRef(defaultRef);

  const onLoad = (map: any) => {
    mapRef.current = map;
  };

  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onLoadPlaces = (place: any) => {
    placeRef.current = place;
  };

  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({
      lat: place.lat(),
      lng: place.lng(),
    });
    setLocation({
      lat: place.lat(),
      lng: place.lng(),
    });
  };

  const onConfirm = () => {
    const places = placeRef.current.getPlaces();
    if (places && places.length === 1) {
      dispatch({
        type: 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION',
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      });
      enqueueSnackbar('Location selected successfully', {
        variant: 'success',
      });
      router.push('/shipping');
    }
  };

  const onMarkerLoad = (marker: any) => {
    markerRef.current = marker;
  };

  return googleApiKey ? (
    <div className={classes.fullContainer}>
      <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
        <GoogleMap
          id="card_map"
          mapContainerStyle={{
            height: '100%',
            width: '100%',
          }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces}
            onPlacesChanged={onPlacesChanged}
          >
            <div className={classes.mapInputBox}>
              <input placeholder="Enter your address" type="text" />
              <Button
                variant="contained"
                onClick={onConfirm}
                color="primary"
                type="button"
              >
                Confirm
              </Button>
            </div>
          </StandaloneSearchBox>
          <Marker position={location} onLoad={onMarkerLoad} />
        </GoogleMap>
      </LoadScript>
    </div>
  ) : (
    <CircularProgress />
  );
};

export default dynamic(() => Promise.resolve(Map), { ssr: false });
