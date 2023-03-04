import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar bg-dark">
        <Link className='navbar-brand' to="/"><i className="fas fa-code"></i> DevConnector</Link>
      <ul>
        <li><Link to="/profile">Developers</Link></li>
        <li><a href="posts.html">Posts</a></li>
        <li>
          <Link to="/register" title="Register"><i className="fas fa-user"></i> <span className="hide-sm">Register</span></Link>
        </li>
        <li>
          <Link to="/login" title="Login"><i className="fas fa-sign-in-alt"></i> <span className="hide-sm">Login</span></Link>
        </li>
      </ul>
    </nav>
    )
  }
}

export default Navbar;
