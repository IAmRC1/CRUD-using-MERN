import React from 'react'
import axios from 'axios'
import { Link, Redirect, } from 'react-router-dom'
import { alertInfo, isAuthenticated, } from '../utils/helper'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { EyeOpen, EyeClosed } from '../assets/svg';

const BASE_URL = "/api/v1/auth"

class SignIn extends React.Component {

  state = { 
    email: '',
    password: '',
    isPasswordVisible: false,
  }

  _validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    } else if(/(^\s+|\s+$)/g.test(values.email)){
      errors.email = 'Spaces not allowed at the start/end';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Please enter a valid email. (Ex. abc@xyz.com)';
    } else if (!values.password) {
      errors.password = 'Password is required';
    } else if(/(^\s+|\s+$)/g.test(values.password)){
      errors.password = 'Spaces not allowed at the start/end';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be 6 chars long.';
    }
    return errors;
  }

  _submitForm = (values, { setSubmitting }) => {
    const user = { email: values.email, password: values.password }
    axios.post(`${BASE_URL}/login`, user)
    .then(res => res.data)
    .then(data => {
      if(!data.error){
        alertInfo('success', 'Successfully Logged In!');
        setSubmitting(false);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return this.props.history.push('/home');
      }
    })
    .catch(err => {
      setSubmitting(false);
      return alertInfo('error', err.response.data.data);
    })
  }

  _togglePasswordView = () => {
    this.setState({ isPasswordVisible: !this.state.isPasswordVisible })
    const password = document.getElementById('loginPassword');
    if(password.type === 'password') {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  }

  render(){
    const { isPasswordVisible, } = this.state;
    if(isAuthenticated()){
      return <Redirect to="/home" />
    }
    return (
      <Formik
       initialValues={{ email: '', password: '' }}
       validate={this._validate}
       onSubmit={(values, { setSubmitting }) => this._submitForm(values, { setSubmitting })}>
       {({ isSubmitting, values }) => (
        <Form noValidate className="form-signup py-5 login-form">
          <h1 className="h3 mb-3 text-center text-uppercase">Login</h1>
          <ErrorMessage name="email" component="div" className="error" />
          <ErrorMessage name="password" component="div" className="error" />
          <Field type="email" id="loginEmail" className="form-control" placeholder="johndoe@gmail.com" name="email" />
          <div className="position-relative">
            <Field type="password" autoComplete={'off'} id="loginPassword" className="form-control" placeholder="Password" name="password" />
            {(values.password || values.confirmPassword) && <label className="toggleView"><input type="checkbox" value={isPasswordVisible} onChange={this._togglePasswordView} /><img src={isPasswordVisible? EyeClosed : EyeOpen} alt={'eye'} /></label>}
          </div>
          <button 
            className="btn btn-lg btn-primary btn-block" 
            type="submit" 
            disabled={isSubmitting || Object.values(values).includes("")}>
              {`Submit${isSubmitting?'ing':''}`}
          </button>
          <p className="text-center text-muted mt-2 mb-2">Don't have an account? <Link to="/register">Register</Link></p>
          <p className="text-center text-muted mb-0"><Link to="/resetpassword">Forgot Password?</Link></p>
        </Form>)}
      </Formik>
    )
  }
}

export default SignIn
