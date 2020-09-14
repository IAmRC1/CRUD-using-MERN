import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { alertInfo } from '../utils/helper'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { default as EyeOpen } from '../assets/svg/eye-open.svg';
import { default as EyeClosed } from '../assets/svg/eye-closed.svg';

class SignUp extends React.Component {

  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isPasswordVisible: false,
  }

  _validate = (values) => {
    const errors = {};
    if (!values.name) {
     errors.name = 'Username is required';
    } else if(/(^\s+|\s+$)/g.test(values.name)){
      errors.name = 'Spaces not allowed at the start/end';
    } else if (values.name.length < 6 || values.name.length > 18) {
      errors.name = 'Username must be 6-18 chars long.';
    } else if (!values.email) {
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
    } else if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if(/(^\s+|\s+$)/g.test(values.confirmPassword)){
      errors.confirmPassword = 'Spaces not allowed at the start/end';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    return errors;
  }

  _submitForm = (values) => {
    const user = { name: values.name, email: values.email, password: values.password }
    axios.post('/api/v1/auth/register', user)
    .then(res => res.data)
    .then(data => {
      if(!data.error){
        alertInfo('success', 'Successfull Registration!')
        return this.props.history.push('/signin')
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
    const confirmPassword = document.getElementById('inputConfirmPassword');
    if(password.type == 'password') {
      password.type = 'text';
      confirmPassword.type = 'text';
    } else {
      password.type = 'password';
      confirmPassword.type = 'password';
    }
  }

  render(){
    return (
      <Formik
       initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
       validate={this._validate}
       onSubmit={(values) => this._submitForm(values)}>
       {({ isSubmitting, values }) => (
        <Form noValidate className="form-signup py-5">
          <h1 className="h3 mb-3 text-center">REGISTER</h1>
          <ErrorMessage name="name" component="div" className="error" />
          <ErrorMessage name="email" component="div" className="error" />
          <ErrorMessage name="password" component="div" className="error" />
          <ErrorMessage name="confirmPassword" component="div" className="error" />
          <Field type="text" id="inputName" className="form-control floating-input" placeholder="John12" name="name" />
          <Field type="email" id="inputEmail" className="form-control" placeholder="johndoe@gmail.com" name="email" />
          <div className="position-relative">
            <Field type="password" autoComplete={'off'} id="inputPassword" className="form-control" placeholder="Password" name="password" />
            {(values.password || values.confirmPassword) && <label className="toggleView"><input type="checkbox" value={this.state.isPasswordVisible} onChange={this._togglePasswordView} /><img src={this.state.isPasswordVisible? EyeClosed : EyeOpen} /></label>}
          </div>
          <Field type="password" autoComplete={'off'} id="inputConfirmPassword" className="form-control" placeholder="Confirm Password" name="confirmPassword" />
          <button 
            className="btn btn-lg btn-primary btn-block" 
            type="submit" 
            disabled={isSubmitting || Object.values(values).includes("")}>
              {`Submit${isSubmitting?'ing':''}`}
          </button>
          <p className="text-center text-muted mt-3">Already have an account? <Link to="/signin">Login here</Link></p>
        </Form>)}
      </Formik>
    )
  }
}

export default SignUp;
