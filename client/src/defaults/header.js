import React from 'react'
import { Link } from 'react-router-dom'
import { default as Bug } from '../assets/svg/bug.svg';

class Header extends React.Component {

  _logOut = () => {
    localStorage.removeItem('token')
    this.props.history.push('/login')
  }

  render(){
    return (
      <React.Fragment>
        <header>
          <div className="collapse bg-dark" id="navbarHeader">
            <div className="container">
              <div className="row">
                <div className="col-sm-8 col-md-7 py-4">
                  <h4 className="text-white">About</h4>
                  <p className="text-muted">Animals CRUD App using MERN Stack. You can Create, Read, Update &amp; Delete animals.</p>
                </div>
                <div className="col-sm-4 offset-md-1 py-4">
                  <h4 className="text-white">Contact</h4>
                  <ul className="list-unstyled">
                    <li><a href="https://www.instagram.com/IAmRC1" className="text-white">Follow on Instagram</a></li>
                    <li><a href="#!" className="text-white">Like on Facebook</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="navbar navbar-dark bg-dark shadow-sm">
            <div className="container d-flex justify-content-between">
              <Link to={localStorage.getItem('token') ? "/home" : "#"} className="navbar-brand d-flex align-items-center mr-0">
                <img src={Bug} alt="bug" />
                <strong className="pl-2">Animals</strong>
              </Link>
              {this.props.location.pathname === '/home' && <div className="d-flex align-items-center nav-btn">
                <Link to="/add">Add Animal</Link>
              </div>}
              <div className="d-flex align-items-center">
                {this.props.location.pathname === '/home' && 
                <div className="d-flex align-items-center nav-btn mr-3">
                  <a role="button" className="btn btn-transparent text-white" onClick={this._logOut}>Sign Out</a>
                </div>
                }
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
              </div>
            </div>
          </div>
        </header>
      </React.Fragment>
    )
  }
}

export default Header