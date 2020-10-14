import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/helper';
import {
  Bug, SignOut, Sun, Moon, Person, Plus,
} from '../assets/svg';

const theme = localStorage.getItem('theme');
const username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : '';

class Header extends React.Component {
  _toggleTheme = () => {
    if (theme === 'dark') {
      return localStorage.setItem('theme', 'light');
    }
    localStorage.setItem('theme', 'dark');
  }

  _logOut = () => {
    localStorage.clear();
    return this.props.history.push('/login');
  }

  render() {
    const { pathname } = this.props.location;
    return (
      <header>
        <div className="navbar navbar-dark bg-dark shadow-lg fixed-top" id="navbarMain">
          <div className="container d-flex justify-content-between">
            <Link to={this.props.location.pathname !== 'home' ? '/home' : '#'} className="navbar-brand d-flex align-items-center mr-0">
              <img src={Bug} alt="bug" className="nav-icons" />
              <strong className="pl-2">Animabry</strong>
            </Link>
            <div className="d-flex align-items-center nav-btn">
              {(pathname === '/home' || pathname === '/profile')
                  && (
                    <Link to="/add" data-tooltip="Add Animal" data-tooltip-location="bottom">
                      <img src={Plus} alt="plus" className="nav-icons" />
                    </Link>
                  )}

              {isAuthenticated() && pathname !== '/profile'
                && (
                  <Link to="/profile" data-tooltip="Profile" data-tooltip-location="bottom">
                    <img src={Person} alt="profile" className="nav-icons" />
                  </Link>
                )}

              <a role="button" onClick={this._toggleTheme} data-tooltip={`${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}`} data-tooltip-location="bottom">
                <img
                  src={theme === 'dark' ? Sun : Moon}
                  alt={theme === 'dark' ? 'light mode' : 'dark mode'}
                  className="nav-icons"
                />
              </a>

              {isAuthenticated()
                  && (
                    <a
                      role="button"
                      data-tooltip="Log Out"
                      data-tooltip-location="bottom"
                      data-toggle="modal"
                      data-target="#logOutModal"
                    >
                      <img src={SignOut} alt="sign out" className="nav-icons" style={{ width: '1.5rem' }} />
                    </a>
                  )}
            </div>
          </div>
        </div>
        <div className="modal fade logout" id="logOutModal" tabIndex="-1" aria-labelledby="logOutModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="logOutModalLabel">{`Hi, @${username}`}</h5>
                <a role="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </a>
              </div>
              <div className="modal-body">
                Do you really want to logout?
              </div>
              <div className="modal-footer">
                <a
                  role="button"
                  className="btn btn-danger btn-block w-50"
                  onClick={this._logOut}
                  data-dismiss="modal"
                >
                  Yes, log me out!

                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
