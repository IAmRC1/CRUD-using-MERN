import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { alertInfo } from '../utils/helper';
import { EyeOpen, EyeClosed } from '../assets/svg';

const BASE_URL = '/api/v1/auth';

class ChangePassword extends React.Component {
  state = {
    isPasswordVisible: false,
  }

  _validate = (values) => {
    const errors = {};
    if (!values.password) {
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

  _submitForm = (values, { setSubmitting }) => {
    const user = { password: values.password };
    const { history } = this.props;
    const { match } = this.props;
    axios.post(`${BASE_URL}/resetpassword/${match.params.token}`, user)
      .then((res) => res.data)
      .then(() => {
        alertInfo('success', 'Successfully Changed Password!');
        setSubmitting(false);
        return history.push('/home');
      })
      .catch((err) => {
        setSubmitting(false);
        return alertInfo('error', err.response.data.message);
      });
  }

  _togglePasswordView = () => {
    const { isPasswordVisible } = this.state;
    this.setState({ isPasswordVisible: !isPasswordVisible });
    const password = document.getElementById('loginEmail');
    const confirmPassword = document.getElementById('regsiterConfirmPassword');
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
    const { match } = this.props;
    if (match.params.token.length !== 24) {
      return <Redirect to="/resetpassword" />;
    }
    return (
      <Formik
        initialValues={{ password: '' }}
        validate={this._validate}
        onSubmit={(values, { setSubmitting }) => this._submitForm(values, { setSubmitting })}
      >
        {({ isSubmitting, values, dirty }) => (
          <Form noValidate className="form-signup py-5 login-form">
            <h1 className="h3 mb-3 text-center text-uppercase">Reset Password</h1>
            <ErrorMessage name="password" component="div" className="error" />
            <ErrorMessage name="confirmPassword" component="div" className="error" />
            <div className="position-relative">
              <Field type="password" autoComplete="off" id="loginEmail" className="form-control" placeholder="New Password" name="password" />
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
              disabled={isSubmitting || !dirty}
            >
              {`Updat${isSubmitting ? 'ing' : 'e'}`}
            </button>
          </Form>
        )}
      </Formik>
    );
  }
}

export default ChangePassword;
