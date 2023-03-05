import React from 'react';
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';


import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';


function App() {
  return (
    <Provider store={store}>
    <Router>
      <div className="App">
        <Navbar />
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/login' element={<Login />} />
          </Routes>
        <Footer />
      </div>
    </Router>
    </Provider>
  );
}

export default App;
