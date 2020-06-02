import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { store } from 'react-notifications-component'
import { notification } from '../utils/notification'

class SignUp extends React.Component {

  state = { 
    email: '',
    password: '',
  }

  _handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  _signUp = e => {
    e.preventDefault();
    const newUser = {
      "email": this.state.email,
      "password": this.state.password
    }
    axios.post('/users', newUser)
    .then(res => res.data)
    .then(data => {
      console.log('data', data)
      if(data.token){
        this.props.history.push('/signin')
      }
      
    })
    .catch(err => store.addNotification({ 
      ...notification,
      message: err.response.data.message,
      type: 'warning'
    }))
  }

  render(){
    return (
      <form className="form-signup py-5" onSubmit={this._signUp}>
        <h1 className="h3 mb-3 font-weight-normal text-center">REGISTER</h1>
        <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input type="email" id="inputEmail" className="form-control" placeholder="Email address" name="email" onChange={this._handleInput} value={this.state.email} />
        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" autoComplete={'off'} name="password" onChange={this._handleInput} value={this.state.password} />
        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>
        <p className="text-center text-muted mt-3">Already have an account? <Link to="/signin">Login here</Link></p>
      </form>
    )
  }
}

export default SignUp
