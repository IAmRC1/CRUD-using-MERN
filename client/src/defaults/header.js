import React from 'react'
import { Link } from 'react-router-dom'
import { isAutheticated } from '../utils/helper'
import { default as Bug } from '../assets/svg/bug.svg';
import { default as SignOut } from '../assets/svg/signout.svg';
import { default as Sun } from '../assets/svg/sun.svg';
import { default as Moon } from '../assets/svg/moon.svg';
import { default as Person } from '../assets/svg/person.svg';
import { default as Plus } from '../assets/svg/plus.svg';
import { default as Expand } from '../assets/svg/expand.svg';
import { default as Shrink } from '../assets/svg/shrink.svg';

const darkmode = () => localStorage.getItem('darkmode') ? true : false

class Header extends React.Component {

  state = {
    isFullScreen: false
  }

  componentDidMount(){
    this.handleNav();
  }

  handleNav = () => {
    let prevScrollposition = window.pageYOffset;
    window.onscroll = () => {
      let currentScrollPos = window.pageYOffset;
      if (prevScrollposition >= currentScrollPos) {
        document.getElementById("navbarMain").style.top = "0";
        document.getElementById("navbarMain").classList.add("shadow-lg")
      } else {
        document.getElementById("navbarMain").style.top = "-60px";
        document.getElementById("navbarMain").classList.remove("shadow-lg")
      }
      prevScrollposition = currentScrollPos;
    }
  }

  _logOut = () => {
    localStorage.removeItem('token')
    this.props.history.push('/login')
  }
  
  _toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.setState({ isFullScreen : true })
    } else if (document.exitFullscreen) {
      document.exitFullscreen(); 
      this.setState({ isFullScreen : false })
    }
  }

  render(){
    return (
      <React.Fragment>
        <header>
          <div className="navbar navbar-dark bg-dark shadow-lg" id="navbarMain">
            <div className="container d-flex justify-content-between">
              <Link to={localStorage.getItem('token') ? "/home" : "#"} className="navbar-brand d-flex align-items-center mr-0">
                <img src={Bug} alt="bug" className="nav-icons" />
                <strong className="pl-2">Animabry</strong>
              </Link>
              <div className="d-flex align-items-center nav-btn">
                {this.props.location.pathname === '/home' && <Link to="/add"><img src={Plus} alt="plus" className="nav-icons" /></Link>}
                  
                <a href="#!" role="button" onClick={this._toggleFullScreen}>
                  <img src={this.state.isFullScreen ? Shrink : Expand} alt={`${this.state.isFullScreen ? "normal" : "full"} screen`} className="nav-icons" />
                </a>

                {(!this.props.location.pathname === '/login' || !this.props.location.pathname === '/register') && <a href="#!"><img src={Person} alt="profile" className="nav-icons" /></a>}

                {darkmode() ? <a href="#!" onClick={() => console.log('implement dark mode')}><img src={Sun} alt="light mode" className="nav-icons" /></a> : <a href="#!"><img src={Moon} alt="dark mode" className="nav-icons" /></a>}

                {isAutheticated() && <a href="#!" role="button" onClick={this._logOut}><img src={SignOut} alt="sign out" className="nav-icons" style={{width: '1.5rem'}} /></a>}
              </div>
            </div>
          </div>
        </header>
      </React.Fragment>
    )
  }
}

export default Header