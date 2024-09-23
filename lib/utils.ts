/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */

import { type ClassValue, clsx } from "clsx";
import qs from "qs";
import { twMerge } from "tailwind-merge";

import { aspectRatioOptions } from "@/constants";

// 合并类名函数，用于合并和优化 TailwindCSS 的类名
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 错误处理函数，用于捕获和处理不同类型的错误
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // 处理原生 JavaScript 错误 (如 TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // 处理字符串类型的错误信息
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // 处理未知类型的错误
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

// 图片加载时的占位符，用于生成渐变动画的SVG
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

// 将字符串转换为Base64格式，用于在浏览器中处理图片的Base64编码
const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

// Base64格式的占位符图片，用于图片加载时显示
export const dataUrl = `data:image/svg+xml;base64,${toBase64(
  shimmer(1000, 1000)
)}`;
// ==== 结束 ====

// URL查询参数的表单处理函数，用于动态生成带参数的URL
export const formUrlQuery = ({
  searchParams,
  key,
  value,
}: FormUrlQueryParams) => {
  const params = { ...qs.parse(searchParams.toString()), [key]: value };

  return `${window.location.pathname}?${qs.stringify(params, {
    skipNulls: true,
  })}`;
};

// 移除URL中的指定查询参数
export function removeKeysFromQuery({
  searchParams,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(searchParams);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  // 移除值为 null 或 undefined 的键
  Object.keys(currentUrl).forEach(
    (key) => currentUrl[key] == null && delete currentUrl[key]
  );

  return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
}

// 函数防抖，用于防止高频触发函数 (如搜索输入框的实时查询)
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// 获取图像尺寸，根据不同的变换类型获取图像的宽或高
export type AspectRatioKey = keyof typeof aspectRatioOptions;
export const getImageSize = (
  type: string,
  image: any,
  dimension: "width" | "height"
): number => {
  if (type === "fill") {
    return (
      aspectRatioOptions[image.aspectRatio as AspectRatioKey]?.[dimension] ||
      1000
    );
  }
  return image?.[dimension] || 1000;
};

// 下载图片功能，通过URL下载资源并创建下载链接
export const download = (url: string, filename: string) => {
  if (!url) {
    throw new Error("资源URL未提供！请提供URL");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;

      if (filename && filename.length)
        a.download = `${filename.replace(" ", "_")}.png`;
      document.body.appendChild(a);
      a.click();
    })
    .catch((error) => console.log({ error }));
};

// 深度合并对象，递归合并两个对象的属性
export const deepMergeObjects = (obj1: any, obj2: any) => {
  if(obj2 === null || obj2 === undefined) {
    return obj1;
  }

  let output = { ...obj2 };

  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (
        obj1[key] &&
        typeof obj1[key] === "object" &&
        obj2[key] &&
        typeof obj2[key] === "object"
      ) {
        output[key] = deepMergeObjects(obj1[key], obj2[key]);
      } else {
        output[key] = obj1[key];
      }
    }
  }

  return output;
};
