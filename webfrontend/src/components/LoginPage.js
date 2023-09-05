import React from 'react';
import LoginForm from './LoginForm';
import Navbar from './Navbar';
import Footer from './Footer';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage;
