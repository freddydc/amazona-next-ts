import mongoose from 'mongoose';

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

const db = { connect, disconnect };

export default db;
