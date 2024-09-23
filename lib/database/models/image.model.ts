//这个文件是一个基于 Mongoose 和 TypeScript 的 MongoDB 数据库模型，
//用于存储与图像相关的数据。开发者可以使用这个模型与 MongoDB 进行交互



import { Document, Schema, model, models } from "mongoose";

// 定义接口 IImage 以确保图像文档在 TypeScript 中具有类型安全性
export interface IImage extends Document {
  title: string;  // 图像标题
  transformationType: string;  // 图像的转换类型，例如缩放、裁剪等
  publicId: string;  // 图像在云服务中的唯一标识符
  secureURL: string;  // 图像的安全 URL
  width?: number;  // 可选字段：图像的宽度
  height?: number;  // 可选字段：图像的高度
  config?: object;  // 可选字段：与图像相关的配置项
  transformationUrl?: string;  // 可选字段：转换后的图像 URL
  aspectRatio?: string;  // 可选字段：图像的宽高比
  color?: string;  // 可选字段：图像的主色调
  prompt?: string;  // 可选字段：与图像生成或处理相关的提示信息
  author: {
    _id: string;  // 作者的用户 ID
    firstName: string;  // 作者的名字
    lastName: string;  // 作者的姓氏
  };
  createdAt?: Date;  // 可选字段：文档创建的时间戳
  updatedAt?: Date;  // 可选字段：文档更新的时间戳
}

// 定义 Mongoose 模型的模式（Schema）
//定义了 MongoDB 中的图像数据模型
const ImageSchema = new Schema({
  title: { type: String, required: true },  // 标题是必填项
  transformationType: { type: String, required: true },  // 转换类型是必填项
  publicId: { type: String, required: true },  // 图像的唯一 ID 是必填项
  secureURL: { type: String, required: true },  // 安全 URL 是必填项
  width: { type: Number },  // 可选字段：图像宽度
  height: { type: Number },  // 可选字段：图像高度
  config: { type: Object },  // 可选字段：图像的配置对象
  transformationUrl: { type: String },  // 可选字段：图像转换后的 URL
  aspectRatio: { type: String },  // 可选字段：宽高比
  color: { type: String },  // 可选字段：主色调
  prompt: { type: String },  // 可选字段：生成提示
  author: { type: Schema.Types.ObjectId, ref: 'User' },  // 引用作者，指向 User 模型
  createdAt: { type: Date, default: Date.now },  // 默认创建时间为当前时间
  updatedAt: { type: Date, default: Date.now }  // 默认更新时间为当前时间
});

// 检查是否已经存在模型，如果存在则使用现有模型，否则创建新模型
const Image = models?.Image || model('Image', ImageSchema);

export default Image;  // 导出 Image 模型
