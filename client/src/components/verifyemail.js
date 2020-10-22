import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { alertInfo } from '../utils/helper';

const BASE_URL = '/api/v1/auth';
const waitTime = 60; // seconds

class Verify extends React.Component {
  state = {
    seconds: waitTime,
    showResendBtn: true,
  }

  _tick = () => {
    const { seconds } = this.state;
    if (seconds > 1) {
      this.setState({ seconds: seconds - 1 });
    } else {
      clearInterval(this._timer);
      this.setState({ showResendBtn: true, seconds: waitTime });
    }
  }

  _resendOTP = () => {
    const { location } = this.props;
    this.setState({ showResendBtn: false, seconds: waitTime }, () => {
      this._timer = setInterval(this._tick, 1000);
      axios.post(`${BASE_URL}/resendtoken`, { email: location.state.email })
        .then((res) => res.data)
        .then(() => alertInfo('success', 'Token resent, check email'))
        .catch((err) => alertInfo('error', err.response.data.message));
    });
  }

  _validate = (values) => {
    const errors = {};
    if (!values.otp) {
      errors.otp = 'OTP is required';
    } else if (/(^\s+|\s+$)/g.test(values.otp)) {
      errors.otp = 'Spaces not allowed at the start/end';
    } else if (values.otp.length < 6) {
      errors.otp = 'OTP must be 6 chars long';
    }
    return errors;
  }

  _submitForm = (values, { setSubmitting, resetForm }) => {
    const user = { otp: values.otp.toUpperCase() };
    const { history } = this.props;
    axios.post(`${BASE_URL}/verifyemail`, user)
      .then((res) => res.data)
      .then(() => {
        setSubmitting(false);
        resetForm();
        alertInfo('success', 'Account verified successfully!');
        return history.push('/login');
      })
      .catch((err) => {
        setSubmitting(false);
        return alertInfo('error', err.response.data.message);
      });
  }

  render() {
    const { seconds, showResendBtn } = this.state;
    return (
      <Formik
        initialValues={{ email: '', otp: '' }}
        validate={this._validate}
        onSubmit={(values, { setSubmitting, resetForm }) => (
          this._submitForm(values, { setSubmitting, resetForm })
        )}
      >
        {({ isSubmitting, dirty }) => (
          <Form noValidate className="form-signup py-5 login-form">
            <h1 className="h3 mb-3 text-center text-uppercase">Verify Email</h1>
            <h6 className="h6 mb-3 text-center text-muted">
              {!showResendBtn && `Wait for ${seconds} second${seconds > 1 ? 's' : ''} before sending another!`}
              {showResendBtn && <a href="#!" role="button" onClick={this._resendOTP}> Resend OTP</a>}
            </h6>
            <ErrorMessage name="otp" component="div" className="error" />
            <Field type="text" id="otp" className="form-control mb-3" placeholder="A1B2C3" name="otp" maxLength="6" />
            <button
              className="btn btn-lg btn-primary btn-block"
              type="submit"
              disabled={isSubmitting || !dirty}
            >
              {`Verify${isSubmitting ? 'ing' : ''}`}
            </button>
            <p className="text-center text-muted mt-2"><Link to="/login">Go Back</Link></p>
          </Form>
        )}
      </Formik>
    );
  }
}

export default Verify;
