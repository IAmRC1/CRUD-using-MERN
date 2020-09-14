import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { alertInfo } from '../utils/helper'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { default as EyeOpen } from '../assets/svg/eye-open.svg';
import { default as EyeClosed } from '../assets/svg/eye-closed.svg';

class SignIn extends React.Component {

  state = { 
    email: '',
    password: '',
    isPasswordVisible: false,
  }

  _submitForm = (values) => {
    const user = { email: values.email, password: values.password }
    axios.post('/api/v1/auth/login', user)
    .then(res => res.data)
    .then(data => {
      if(!data.error){
        alertInfo('success', 'Successfully Logged In!')
        window.localStorage.setItem('token', data.data)  
        this.props.history.push('/main')
      }
    })
    .catch(err => {
      const { errors } = err.response.data
      errors.map(err => {
        const keys = Object.keys(err)
        alertInfo('error', err[keys])
      })
    })
   }

  _togglePasswordView = () => {
    this.setState({ isPasswordVisible: !this.state.isPasswordVisible })
    const password = document.getElementById('inputPassword');
    if(password.type == 'password') {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  }

  render(){
    return (
      <Formik
       initialValues={{ email: '', password: '' }}
       validate={this._validate}
       onSubmit={(values) => this._submitForm(values)}>
       {({ isSubmitting, values }) => (
        <Form noValidate className="form-signup py-5">
          <h1 className="h3 mb-3 text-center">LOGIN</h1>
          <ErrorMessage name="email" component="div" className="error" />
          <ErrorMessage name="password" component="div" className="error" />
          <Field type="email" id="inputEmail" className="form-control" placeholder="johndoe@gmail.com" name="email" />
          <div className="position-relative">
            <Field type="password" autoComplete={'off'} id="inputPassword" className="form-control" placeholder="Password" name="password" />
            {(values.password || values.confirmPassword) && <label className="toggleView"><input type="checkbox" value={this.state.isPasswordVisible} onChange={this._togglePasswordView} /><img src={this.state.isPasswordVisible? EyeClosed : EyeOpen} /></label>}
          </div>
          <button 
            className="btn btn-lg btn-primary btn-block" 
            type="submit" 
            disabled={isSubmitting || Object.values(values).includes("")}>
              {`Submit${isSubmitting?'ing':''}`}
          </button>
          <p className="text-center text-muted mt-3">Already have an account? <Link to="/">Register here</Link></p>
        </Form>)}
      </Formik>
    )
  }
}

export default SignIn
