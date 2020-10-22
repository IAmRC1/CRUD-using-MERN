import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { alertInfo } from '../utils/helper';

const BASE_URL = '/api/v1/auth';

class ResetPassword extends React.Component {
  _validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (/(^\s+|\s+$)/g.test(values.email)) {
      errors.email = 'Spaces not allowed at the start/end';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Please enter a valid email. (Ex. abc@xyz.com)';
    }
    return errors;
  }

  _submitForm = (values, { setSubmitting, resetForm }) => {
    const user = { email: values.email };
    axios.post(`${BASE_URL}/resetpassword`, user)
      .then((res) => res.data)
      .then(() => {
        setSubmitting(false);
        resetForm();
        return alertInfo('success', 'Reset link sent successfully!');
      })
      .catch((err) => {
        setSubmitting(false);
        return alertInfo('error', err.response.data.message);
      });
  }

  render() {
    return (
      <Formik
        initialValues={{ email: '' }}
        validate={this._validate}
        onSubmit={(values, { setSubmitting, resetForm }) => (
          this._submitForm(values, { setSubmitting, resetForm })
        )}
      >
        {({ isSubmitting, dirty }) => (
          <Form noValidate className="form-signup py-5 login-form">
            <h1 className="h3 mb-3 text-center text-uppercase">Reset Password</h1>
            <ErrorMessage name="email" component="div" className="error" />
            <Field type="email" id="forgotPasswordEmail" className="form-control mb-3" placeholder="johndoe@gmail.com" name="email" />
            <button
              className="btn btn-lg btn-primary btn-block"
              type="submit"
              disabled={isSubmitting || !dirty}
            >
              Send Reset Link
            </button>
            <p className="text-center text-muted mt-2"><Link to="/login">Go Back</Link></p>
          </Form>
        )}
      </Formik>
    );
  }
}

export default ResetPassword;
