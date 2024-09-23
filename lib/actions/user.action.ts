"use server";
import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// 创建用户
// CREATE 参数类型在index.d.ts文件中所定义
export async function createUser(user: CreateUserParams) {
  try {
    // 连接到数据库
    await connectToDatabase();

    // 创建新用户
    const newUser = await User.create(user);

    // 返回新用户对象
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    // 处理错误
    handleError(error);
  }
}

// 根据用户ID获取用户信息
// READ
export async function getUserById(userId: string) {
  try {
    // 连接到数据库
    await connectToDatabase();

    // 查找用户
    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    // 返回用户对象
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    // 处理错误
    handleError(error);
  }
}

// 更新用户信息
// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    // 连接到数据库
    await connectToDatabase();

    // 根据 clerkId 查找并更新用户
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,  // 返回更新后的用户
    });

    if (!updatedUser) throw new Error("User update failed");
    
    // 返回更新后的用户对象
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    // 处理错误
    handleError(error);
  }
}

// 删除用户
// DELETE
export async function deleteUser(clerkId: string) {
  try {
    // 连接到数据库
    await connectToDatabase();

    // 查找需要删除的用户
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // 删除用户
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    // 返回已删除的用户对象或 null
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    // 处理错误
    handleError(error);
  }
}

// 更新用户积分
// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    // 连接到数据库
    await connectToDatabase();

    // 查找用户并更新积分
    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee }},  // 增加用户的积分
      { new: true }  // 返回更新后的用户
    )

    if(!updatedUserCredits) throw new Error("User credits update failed");

    // 返回更新后的用户对象
    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    // 处理错误
    handleError(error);
  }
}
