import mongoose from 'mongoose';
import { Products } from '@utils/types';

type Connection = {
  isConnected: number | boolean;
};

const connection = {} as Connection;

const connect = async () => {
  if (connection.isConnected) {
    console.log('Already Connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log('Use Previous Connection');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(`${process.env.MONGODB_URI}`);
  console.log('New Connection');
  connection.isConnected = db.connections[0].readyState;
};

const disconnect = async () => {
  if (connection.isConnected) {
    if (`${process.env.NODE_ENV}` === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('No Disconnected');
    }
  }
};

const convertDocToObj = (doc: Products) => {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
};

const db = { connect, disconnect, convertDocToObj };

export default db;
