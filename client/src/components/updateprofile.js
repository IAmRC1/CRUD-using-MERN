import React from 'react'
import axios from 'axios'
import { Redirect, } from 'react-router-dom'
import { Avatar, Upload, } from '../assets/svg'
import { alertInfo, isAuthenticated, inputTextArea, } from '../utils/helper'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { capitalize } from 'lodash'

const BASE_URL = "/api/v1/auth"
const maxChar = 100;

class UpdateProfile extends React.Component {

  state = {
    user: {},
  }

  componentDidMount(){
    this._getProfile();
  }

  _getProfile = () => {
    const id = JSON.parse(localStorage.getItem('user')).id
    axios.get(`${BASE_URL}/${id}`, 
      { headers: { 'token': localStorage.getItem('token') }})
      .then(res => res.data)
      .then(data => {
        if(!data.error){
          this.setState({ 
            user: {
              id: data.data._id,
              username: data.data.username,
              email: data.data.email,
              firstname: capitalize(data.data.firstname),
              lastname: capitalize(data.data.lastname),
              bio: data.data.bio,
            },
          },
          )
        }
      })
      .catch(err => {
        alertInfo('error', err.response.data.message)
      })
  }

  _validate = (values) => {
    const errors = {};
    if (!values.firstname) {
      errors.firstname = 'First Name is required';
    } else if(/(^\s+|\s+$)/g.test(values.firstname)){
      errors.firstname = 'Spaces not allowed at the start/end';
    } else if (values.firstname.length < 3) {
      errors.firstname = 'First Name must be 3-20 chars long.';
    } else if (!values.lastname) {
      errors.lastname = 'Last Name is required';
    } else if(/(^\s+|\s+$)/g.test(values.lastname)){
      errors.lastname = 'Spaces not allowed at the start/end';
    } else if (values.lastname.length < 3) {
      errors.lastname = 'Last Name must be 3-20 chars long.';
    } else if (!values.bio) {
      errors.bio = 'Bio is required';
    } else if(/(^\s+|\s+$)/g.test(values.bio)){
      errors.bio = 'Spaces not allowed at the start/end';
    } else if (values.bio.length < 50) {
      errors.bio = `Bio must be 50-${maxChar} chars long.`;
    }
    return errors;
  }

  _submitForm = (values, { setSubmitting }) => {
    const updatedUser = { firstname: values.firstname, lastname: values.lastname, bio: values.bio }
    const id = JSON.parse(localStorage.getItem('user')).id
    axios.post(`${BASE_URL}/${id}`, updatedUser,
    { headers: { 'token' : localStorage.getItem('token') }})
    .then(res => res.data)
    .then(data => {
      if(!data.error){
        alertInfo('success', 'User updated successfully')
        setSubmitting(false);
        return this.props.history.push('/profile')
      }
    })
    .catch(err => {
      setSubmitting(false);
      return alertInfo('error', err.response.data.message)
    })
  }  

  render(){
    const { user, } = this.state;
    if(!isAuthenticated()){
      return <Redirect to="/login" />
    }
    return (
      <div className="edit-profile py-5 bg-light">
        <div className="container">
          <div className="user-section py-5">
            <div className="user-section-block">
              <div className="user-image">
                <img crossOrigin="anonymous" src={Avatar} alt="user" className="img" />
                <div className="upload-icon">
                  <img src={Upload} alt="upload" className="img img-fluid" />
                </div>
              </div>
              <div className="user-details">
                <p className="user-name">{`@${(user && user.username)}` || "@username"}</p>
                <p className="user-email">{(user && user.email) || "User Email"}</p>
              </div>
            </div>
            <div className="user-details-block mt-5">
              <Formik
                enableReinitialize={true}
                initialValues={this.state.user}
                validate={this._validate}
                onSubmit={(values, { setSubmitting },) => this._submitForm(values, { setSubmitting })}>
                  {({ isSubmitting, values, dirty }) => (
                    <Form noValidate>
                      <div className="form-row">
                        <div className="form-group col-xs-12 col-md-6">
                          <Field type="text" id="inputFirstName" className="form-control" placeholder="John" name="firstname" maxLength="20" />
                          <ErrorMessage name="firstname" component="div" className="error" />
                        </div>
                        <div className="form-group col-xs-12 col-md-6">
                          <Field type="text" id="inputLastName" className="form-control" placeholder="Doe" name="lastname" maxLength="20" />
                          <ErrorMessage name="lastname" component="div" className="error" />
                        </div>
                      </div>
                      <ErrorMessage name="bio" component="div" className="error" />
                      <Field id="inputBio" className="form-control" placeholder="Write something about yourself" name="bio" rows="4" style={{resize: "none"}} maxLength={maxChar} component={inputTextArea} />
                      <button 
                        type="submit"
                        className="btn btn-block btn-primary text-uppercase mt-3"
                        disabled={isSubmitting || Object.values(values).includes("") || !dirty}>
                          {`Updat${isSubmitting?'ing':'e'}`}
                      </button>
                    </Form>
                  )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UpdateProfile;
