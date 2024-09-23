import mongoose, { Mongoose } from 'mongoose';

//promise用于表示连接 MongoDB 的异步操作。它代表了一个尚未完成的操作
// 从环境变量中获取 MongoDB 的连接 URL
const MONGODB_URL = process.env.MONGODB_URL;

// 定义一个接口来描述 Mongoose 的连接状态
interface MongooseConnection {
  conn: Mongoose | null; // 表示当前的 Mongoose 连接，如果没有连接则为 null
  promise: Promise<Mongoose> | null; // 表示一个用于连接数据库的 promise，如果还未创建则为 null
}

// 将 Mongoose 连接缓存到全局对象中，防止重复连接
//这个缓存允许我们在服务器端代码中多次调用 connectToDatabase 时复用同一个连接。
let cached: MongooseConnection = (global as any).mongoose;

// 如果全局的 mongoose 对象未初始化，则初始化它
if (!cached) {
  cached = (global as any).mongoose = {
    conn: null, // 当前连接对象为 null
    promise: null, // 当前连接的 promise 为 null
  };
}

// 定义一个函数，用于连接到数据库
export const connectToDatabase = async () => {
  // 如果已有缓存的连接，则直接返回，不再重新连接
  if (cached.conn) return cached.conn;

  // 如果没有配置 MONGODB_URL，抛出错误
  if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  // 如果没有已有的 promise，则创建一个新的数据库连接 promise
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: 'imaginify', // 指定数据库名
      bufferCommands: false, // 禁用命令缓冲
    });

  // 等待 promise 完成并将结果缓存
  cached.conn = await cached.promise;

  // 返回已经建立的连接
  return cached.conn;
};
