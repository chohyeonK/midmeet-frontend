import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Layout from './components/layouts/Layout';
import SignUpSuccess from './pages/SignUpSuccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <Layout>
              <Home />
            </Layout>
          }
        ></Route>
        <Route
          path='/signup'
          element={
            <Layout>
              <SignUp />
            </Layout>
          }
        ></Route>
        <Route
          path='/signup/success'
          element={
            <Layout>
              <SignUpSuccess />
            </Layout>
          }
        ></Route>
        <Route
          path='/login'
          element={
            <Layout>
              <Login />
            </Layout>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
