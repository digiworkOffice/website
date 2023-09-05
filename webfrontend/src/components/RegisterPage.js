import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import RegistrationForm from './RegistrationForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <RegistrationForm />
      </main>
      <Footer />
    </div>
  )
}

export default RegisterPage;
