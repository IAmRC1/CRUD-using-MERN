import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { capitalize } from 'lodash';
import { Avatar, Upload, Cross } from '../assets/svg';
import {
  alertInfo, isAuthenticated, inputTextArea, timeAgo,
} from '../utils/helper';

const BASE_URL = '/api/v1/auth';
const maxChar = 100;

class UpdateProfile extends React.Component {
  state = {
    user: {},
    image: null,
  }

  componentDidMount() {
    this._getProfile();
  }

  _getProfile = () => {
    const { id } = JSON.parse(localStorage.getItem('user'));
    axios.get(`${BASE_URL}/${id}`,
      { headers: { token: localStorage.getItem('token') } })
      .then((res) => res.data)
      .then((data) => {
        if (!data.error) {
          this.setState({
            user: {
              id: data.data._id,
              username: data.data.username,
              email: data.data.email,
              firstname: capitalize(data.data.firstname),
              lastname: capitalize(data.data.lastname),
              bio: data.data.bio,
              image: data.data.image,
              createdAt: data.data.createdAt,
            },
          });
        }
      })
      .catch((err) => {
        alertInfo('error', err.response.data.message);
      });
  }

  _validate = (values) => {
    const minSize = 50 * 1024; // 100 kb
    const maxSize = 2 * (1024 ** 2); // 2 mb
    const mimeType = 'image/jpeg, image/jpg, image/png';
    const errors = {};
    if (!values.firstname) {
      errors.firstname = 'First Name is required';
    } else if (/(^\s+|\s+$)/g.test(values.firstname)) {
      errors.firstname = 'Spaces not allowed at the start/end';
    } else if (values.firstname.length < 3) {
      errors.firstname = 'First Name must be 3-20 chars long.';
    } else if (!values.lastname) {
      errors.lastname = 'Last Name is required';
    } else if (/(^\s+|\s+$)/g.test(values.lastname)) {
      errors.lastname = 'Spaces not allowed at the start/end';
    } else if (values.lastname.length < 3) {
      errors.lastname = 'Last Name must be 3-20 chars long.';
    } else if (!values.bio) {
      errors.bio = 'Bio is required';
    } else if (/(^\s+|\s+$)/g.test(values.bio)) {
      errors.bio = 'Spaces not allowed at the start/end';
    } else if (values.bio.length < 50) {
      errors.bio = `Bio must be 50-${maxChar} chars long.`;
    } else if (values.image) {
      const file = values.image;
      if (!mimeType.includes(file.type)) {
        errors.image = 'Extension must be jpg, jpeg, png';
      } else if (file.size < minSize) {
        errors.image = 'Uploaded file must be atleast 50KB';
      } else if (file.size > maxSize) {
        errors.image = 'Uploaded file cannot exceed 2MB size';
      }
    }
    return errors;
  }

  _submitForm = (values, { setSubmitting }) => {
    const { id } = JSON.parse(localStorage.getItem('user'));
    const updatedUser = new FormData();
    updatedUser.append('firstname', values.firstname);
    updatedUser.append('lastname', values.lastname);
    updatedUser.append('bio', values.bio);
    updatedUser.append('image', values.image);
    axios.patch(`${BASE_URL}/${id}`, updatedUser,
      { headers: { token: localStorage.getItem('token') } })
      .then((res) => res.data)
      .then((data) => {
        if (!data.error) {
          setSubmitting(false);
          return this.props.history.push('/profile');
        }
      })
      .catch((err) => {
        setSubmitting(false);
        return alertInfo('error', err.response.data.message);
      });
  }

  _handleFileUpload = (e, { setFieldValue }) => {
    if (e.target.files) {
      this.setState({ image: URL.createObjectURL(e.target.files[0]) });
      setFieldValue('image', e.target.files[0]);
      document.getElementById('server-image').style.display = 'none';
      document.getElementById('local-image').style.display = 'inline-block';
      document.getElementById('upload-icon').style.display = 'none';
      document.getElementById('remove-icon').style.display = 'flex';
    }
  }

  _removeFileUpload = () => {
    const localImageError = document.getElementById('local-image-error');
    document.getElementById('server-image').style.display = 'inline-block';
    document.getElementById('local-image').style.display = 'none';
    document.getElementById('upload-icon').style.display = 'flex';
    document.getElementById('remove-icon').style.display = 'none';
    if (localImageError) localImageError.style.display = 'none';
    this.setState({ image: null });
  }

  render() {
    const { user, image } = this.state;
    if (!isAuthenticated()) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="edit-profile py-5 bg-light">
        <div className="container">
          <div className="user-section py-5">
            <Formik
              enableReinitialize
              initialValues={user}
              validate={this._validate}
              onSubmit={(values, { setSubmitting }) => this._submitForm(values, { setSubmitting })}
            >
              {({
                isSubmitting, values, dirty, setFieldValue,
              }) => (
                <Form noValidate>
                  <div className="user-section-block">
                    <div className="user-image">
                      <img
                        crossOrigin="anonymous"
                        src={user && user.image && user.image !== '' ? user.image : Avatar}
                        alt="user"
                        className="img"
                        id="server-image"
                      />
                      <img
                        crossOrigin="anonymous"
                        src={image}
                        alt="user"
                        className="img"
                        id="local-image"
                        style={{ display: 'none' }}
                      />
                      <div className="upload-icon" id="upload-icon">
                        <label htmlFor="upload-user-icon" className="m-0">
                          <img src={Upload} alt="upload" className="img" />
                          <Field
                            name="image"
                            type="file"
                            id="upload-user-icon"
                            value=""
                            onChange={(e) => this._handleFileUpload(e, { setFieldValue })}
                          />
                        </label>
                      </div>
                      <div
                        id="remove-icon"
                        className="upload-icon"
                        style={{ display: 'none' }}
                        onClick={this._removeFileUpload}
                      >
                        <img src={Cross} alt="cross" className="img" />
                      </div>
                      <ErrorMessage name="image" component="div" className="error position-absolute" id="local-image-error" />
                    </div>
                    <div className="user-details">
                      <p className="user-name">{`@${user.username}`}</p>
                      <p className="user-email">{user.email}</p>
                      <p className="user-email">
                        joined
                        {' '}
                        {timeAgo(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="user-details-block mt-5">
                    <div className="form-row">
                      <div className="form-group col-xs-12 col-md-6">
                        <Field
                          type="text"
                          id="inputFirstName"
                          className="form-control"
                          placeholder="John"
                          name="firstname"
                          maxLength="20"
                        />
                        <ErrorMessage name="firstname" component="div" className="error" />
                      </div>
                      <div className="form-group col-xs-12 col-md-6">
                        <Field
                          type="text"
                          id="inputLastName"
                          className="form-control"
                          placeholder="Doe"
                          name="lastname"
                          maxLength="20"
                        />
                        <ErrorMessage name="lastname" component="div" className="error" />
                      </div>
                    </div>
                    <ErrorMessage name="bio" component="div" className="error" />
                    <Field
                      id="inputBio"
                      className="form-control"
                      placeholder="Write something about yourself"
                      name="bio"
                      rows="4"
                      style={{ resize: 'none' }}
                      maxLength={maxChar}
                      component={inputTextArea}
                    />
                    <button
                      type="submit"
                      className="btn btn-block btn-primary text-uppercase mt-3"
                      disabled={isSubmitting || Object.values(values).includes('') || !dirty}
                    >
                      {`Updat${isSubmitting ? 'ing' : 'e'}`}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

export default UpdateProfile;
