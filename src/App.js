import React from 'react';
import Footer from './containers/Footer';
import Header from './containers/Header';
import Form from './containers/Form';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header></Header>
      <Form></Form>
      <Footer/>
    </div>
  );
}

export default App;
