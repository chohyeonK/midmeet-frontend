import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <>
      <div className='flex flex-col min-h-screen pt-2'>
        <div className='flex-grow'>
          <div className='max-w-7xl mx-auto'>
            <Header />
            <main className='px-6 py-10'>
              <Outlet />
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
