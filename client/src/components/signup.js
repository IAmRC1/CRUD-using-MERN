import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { alertInfo } from '../utils/helper';
import { EyeOpen, EyeClosed } from '../assets/svg';

const BASE_URL = '/api/v1/auth';

class SignUp extends React.Component {
  state = {
    isPasswordVisible: false,
  }

  _validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Username is required';
    } else if (/(^\s+|\s+$)/g.test(values.username)) {
      errors.username = 'Spaces not allowed at the start/end';
    } else if (values.username.length < 4) {
      errors.username = 'Username must be 4-16 chars long.';
    } else if (!/[0-9]/g.test(values.username)) {
      errors.username = 'Username must be alphanumeric.';
    } else if (!values.email) {
      errors.email = 'Email is required';
    } else if (/(^\s+|\s+$)/g.test(values.email)) {
      errors.email = 'Spaces not allowed at the start/end';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Please enter a valid email. (Ex. abc@xyz.com)';
    } else if (!values.password) {
      errors.password = 'Password is required';
    } else if (/(^\s+|\s+$)/g.test(values.password)) {
      errors.password = 'Spaces not allowed at the start/end';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be 6 chars long.';
    } else if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (/(^\s+|\s+$)/g.test(values.confirmPassword)) {
      errors.confirmPassword = 'Spaces not allowed at the start/end';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    return errors;
  }

  _submitForm = (values) => {
    const user = { username: values.username, email: values.email, password: values.password };
    const { history } = this.props;
    axios.post(`${BASE_URL}/register`, user)
      .then((res) => res.data)
      .then(() => {
        alertInfo('success', 'Successfull Registration!');
        return history.push({
          pathname: '/verify',
          state: { email: values.email },
        });
      })
      .catch((err) => {
        if (err.response.status === 400) {
          return alertInfo('error', err.response.data.message);
        }
        const { errors } = err.response.data;
        return errors.map((erro) => {
          const keys = Object.keys(erro);
          return alertInfo('error', erro[keys]);
        });
      });
  }

  _togglePasswordView = () => {
    this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('registerConfirmPassword');
    if (password.type === 'password') {
      password.type = 'text';
      confirmPassword.type = 'text';
    } else {
      password.type = 'password';
      confirmPassword.type = 'password';
    }
  }

  render() {
    const { isPasswordVisible } = this.state;
    return (
      <Formik
        initialValues={{
          username: '', email: '', password: '', confirmPassword: '',
        }}
        validate={this._validate}
        onSubmit={(values) => this._submitForm(values)}
      >
        {({
          isSubmitting, values, dirty, isValid,
        }) => (
          <Form noValidate className="form-signup py-5 register-form">
            <h1 className="h3 mb-3 text-center text-uppercase">Register</h1>
            <ErrorMessage name="username" component="div" className="error" />
            <ErrorMessage name="email" component="div" className="error" />
            <ErrorMessage name="password" component="div" className="error" />
            <ErrorMessage name="confirmPassword" component="div" className="error" />
            <Field type="text" id="registerName" className="form-control" placeholder="john12" name="username" maxLength="16" />
            <Field type="email" id="registerEmail" className="form-control" placeholder="johndoe@gmail.com" name="email" />
            <div className="position-relative">
              <Field type="password" autoComplete="off" id="registerPassword" className="form-control" placeholder="Password" name="password" />
              {(values.password || values.confirmPassword) && (
                <label className="toggleView" htmlFor="togglePassword">
                  <input type="checkbox" value={isPasswordVisible} onChange={this._togglePasswordView} id="togglePassword" />
                  <img src={isPasswordVisible ? EyeClosed : EyeOpen} alt="eye" />
                </label>
              )}
            </div>
            <Field type="password" autoComplete="off" id="registerConfirmPassword" className="form-control" placeholder="Confirm Password" name="confirmPassword" />
            <button
              className="btn btn-lg btn-primary btn-block"
              type="submit"
              disabled={isSubmitting || !dirty || !isValid}
            >
              {`Submit${isSubmitting ? 'ing' : ''}`}
            </button>
            <p className="text-center text-muted mt-2 mb-0">
              Already have an account?
              <Link to="/login"> Login</Link>
            </p>
          </Form>
        )}
      </Formik>
    );
  }
}

export default SignUp;
