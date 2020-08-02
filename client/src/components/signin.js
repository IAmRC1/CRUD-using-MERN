import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { store } from 'react-notifications-component'

class SignIn extends React.Component {

  state = { 
    email: '',
    password: '',
  }

  _handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  _signIn = e => {
    e.preventDefault();
    const newUser = {
      "email": this.state.email,
      "password": this.state.password
    }
    
    axios.post('/auth', newUser)
    .then(res => res.data)
    .then(data => {
      if(data.token){
        axios.get('/auth/user', { headers: { 'x-auth-token' : localStorage.getItem('x-auth-token') }})
        .then(res => res.data)
        .then(data => {
          if(data._id) this.props.history.push('/main')
        })
        .catch(err => console.log('err', err))
      }
    })
    .catch(err => console.log('err', err))
  }

  render(){
    return (
      <form className="form-signup py-5" onSubmit={this._signIn}>
        <h1 className="h3 mb-3 font-weight-normal text-center">LOGIN</h1>
        <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required name="email" onChange={this._handleInput} value={this.state.email} />
        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required autoComplete={'off'} name="password" onChange={this._handleInput} value={this.state.password} />
        <button className="btn btn-lg btn-primary btn-block mt-3" type="submit">Login</button>
        <p className="text-center text-muted mt-3">Don't have an account? <Link to="/">Register here</Link></p>
      </form>
    )
  }
}

export default SignIn
