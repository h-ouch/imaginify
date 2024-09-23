"use client";
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/constants';
import { Button } from '../ui/button';

const Sidebar = () => {
  const pathname = usePathname(); // 一个钩子（hook），用于获取当前页面的路径（URL 的路径部分）
  
  return (
    // aside 标签表示页面的侧边栏
    <aside className="sidebar hidden md:flex">  
      {/* 使用 flex 布局并将元素垂直排列 */}
      <div className="flex size-full flex-col gap-4">
        
        {/* 网站 logo，点击跳转到首页 */}
        <Link href="/" className="sidebar-logo">
          <Image src="/assets/images/logo-text.svg" alt="logo" width={180} height={28} />
        </Link>
        
        {/* 侧边栏导航部分 */}
        <nav className="sidebar-nav">
          
          {/* 如果用户已登录，显示导航菜单 */}
          <SignedIn>
            <ul className="sidebar-nav_elements">
              {/* 遍历 navLinks 数组，动态生成导航项 */}
              {navLinks.slice(0, 6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  // 动态设置导航项的样式，如果是当前路径则高亮显示
                  <li key={link.route} className={`w-full sidebar-nav_element group ${isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'}`}>
                    <Link className="sidebar-link flex items-center" href={link.route}>
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            <ul className="sidebar-nav_elements">
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'}`}>
                    <Link className="sidebar-link flex items-center" href={link.route}>
                      <Image 
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              
              <li className="flex-center cursor-pointer gap-2 p-4">
                <UserButton afterSignOutUrl='/' showName />
              </li>
            </ul>
          </SignedIn>

          {/* 如果用户未登录，显示登录按钮 */}
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
