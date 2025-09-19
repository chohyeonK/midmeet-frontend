import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className='flex min-h-screen items-center justify-center bg-green-500 text-white text-4xl font-bold'>
        Tailwind v4 적용 완료 🎉
      </div>
      <div>
        <h1>Hello</h1>
      </div>
    </>
  );
}

export default App;
