import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { store } from 'react-notifications-component'
import { notification } from '../utils/utils'

class SignUp extends React.Component {

  state = {
    name: '', 
    age: '',
    gender: '',
    email: '',
    password: '',
  }

  _handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  _customNotif = (type, title, message) => {
    store.addNotification({ title, message, type, ...notification })
  }

  _register = e => {
    e.preventDefault();
    const { name, age, gender, email, password } = this.state; 
    const user = { name, age, gender, email, password }
    axios.post('/users', user)
    .then(res => res.data)
    .then(data => {
      if(data.success){
        this._customNotif('success', 'Successful Registration', 'a')
        return this.props.history.push('/signin')
      }
      this._customNotif('warning', 'User already Exists', 'a')
    })
    .catch(err => this._customNotif('danger', 'Error', 'b'))
  }

  render(){
    const { name, email, password, age} = this.state;
    return (
      <form className="form-signup py-5" onSubmit={this._register}>
        <h1 className="h3 mb-3 text-center">REGISTER</h1>
        <fieldset>
          <label htmlFor="inputName" className="sr-only">Name</label>
          <input type="text" id="inputName" className="form-control" placeholder="Name" name="name" onChange={this._handleInput} value={name} />
        </fieldset>
        <fieldset>
          <label htmlFor="inputAge" className="sr-only">Age</label>
          <input type="number" min="12" max="50" id="inputAge" className="form-control" placeholder="Age" name="age" onChange={this._handleInput} value={age} />
        </fieldset>
        <fieldset className="d-flex justify-content-between my-2">
          <div>
            <div className="custom-control custom-radio custom-control-inline">
              <input type="radio" id="male" name="gender" className="custom-control-input" onChange={this._handleInput} value={'male'} />
              <label className="custom-control-label" htmlFor="male">Male</label>
            </div>
            <div className="custom-control custom-radio custom-control-inline">
              <input type="radio" id="female" name="gender" className="custom-control-input" onChange={this._handleInput} value={'female'} />
              <label className="custom-control-label" htmlFor="female">Female</label>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input type="email" id="inputEmail" className="form-control" placeholder="Email address" name="email" onChange={this._handleInput} value={email} />
        </fieldset>
        <fieldset>
          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" autoComplete={'off'} name="password" onChange={this._handleInput} value={password} />
        </fieldset>
        <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={!name || !age || !email 
        || !password}>Sign Up</button>
        <p className="text-center text-muted mt-3">Already have an account? <Link to="/signin">Login here</Link></p>
      </form>
    )
  }
}

export default SignUp
