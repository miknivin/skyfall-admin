import mongoose from "mongoose";

export const connectDatabase = (callback) => {
    let DB_URI = "";

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        DB_URI = process.env.DB_LOCAL_URI;
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        DB_URI = process.env.DB_URI;
    }

    mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((c) => {
            console.log(`Mongo db connected with HOST: ${c?.connection?.host}`);
            callback();
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
            callback(err);
        });
};
