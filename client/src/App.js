import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  return (
    <>
      <Helmet>
        <title>Welcome to Shopping Karo</title>
        <meta name="description" content="We offer a wide range of top-quality products at competitive prices" />
        <meta name="keywords" content="ecommerce, buy products, sell products, online shopping" />
      </Helmet>
      <ScrollToTop />
      <Header />
      <main className="py-3">
        <Container>
          
            <Outlet />
          
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
