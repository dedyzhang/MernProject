import React from 'react';
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import './App.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
        </Routes>
          <div className='container'>
            <Routes>
              <Route exact path='/register' element={<Register />} />
              <Route exact path='/login' element={<Login />} />
            </Routes>
          </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
