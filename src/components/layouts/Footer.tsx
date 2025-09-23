// src/components/layouts/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='bg-mint-500 text-white py-12'>
      <div className='container mx-auto px-4 text-center'>
        <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
          <div className='text-sm'>
            <p>고객센터 | admin@inha.edu</p>
          </div>
          <div className='flex space-x-4'>
            <p>&copy; 2025 Midmeet. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
