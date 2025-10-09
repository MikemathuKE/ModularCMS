import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn__: Promise<typeof mongoose> | undefined;
}

export async function dbConnect() {
  if (!global.__mongooseConn__) {
    global.__mongooseConn__ = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB,
    });
  }
  return global.__mongooseConn__;
}
