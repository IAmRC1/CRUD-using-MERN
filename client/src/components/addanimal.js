import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { alertInfo, isAutheticated } from '../utils/helper'
import { Formik, Form, Field, ErrorMessage } from 'formik';

const token = localStorage.getItem('token')

const maxChar = 100;
const InputTextArea = ({ field, form, ...props }) => (
  <React.Fragment>
    <textarea {...field} {...props} ></textarea>
    <p className="text-right text-muted small m-0">{field.value.length}/{maxChar}</p>
  </React.Fragment>
);

class Addanimal extends React.Component {

  state = {
    name: "",
    category: "",
    image: "",
    description: ""
  }

  _validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    } else if(/(^\s+|\s+$)/g.test(values.name)){
      errors.name = 'Spaces not allowed at the start/end';
    } else if (values.name.length < 3) {
      errors.name = 'Name must be 3-12 chars long.';
    } else if (!values.category) {
      errors.category = 'Category is required';
    } else if(/(^\s+|\s+$)/g.test(values.category)){
      errors.category = 'Spaces not allowed at the start/end';
    } else if (values.category.length < 3) {
      errors.category = 'Category must be 3-12 chars long.';
    } else if (!values.image) {
      errors.image = 'Image is required';
    } else if(/(^\s+|\s+$)/g.test(values.image)){
      errors.image = 'Spaces not allowed at the start/end';
    } else if (!values.description) {
      errors.description = 'Description is required';
    } else if(/(^\s+|\s+$)/g.test(values.description)){
      errors.description = 'Spaces not allowed at the start/end';
    } else if (values.description.length < 30) {
      errors.description = 'Description must be 30-100 chars long.';
    }
    return errors;
  }

  _submitForm = (values, { setSubmitting }) => {
    const animal = { 
      name: values.name,
      category: values.category,
      image: values.image,
      description: values.description,
     }
    axios.post('/api/v1/animals', animal, { headers: { 'token' : token }})
    .then(res => res.data)
    .then(data => {
      if(!data.error){
        alertInfo('success', 'Animal created successfully')
        setSubmitting(false);
        return this.props.history.push('/home')
      }
    })
    .catch(err => {
      setSubmitting(false);
      return alertInfo('error', err.response.data.data);
    })
  }

  render(){
    if(!isAutheticated()){
      return <Redirect to="/login" />
    }
    return (
      <main className="container py-5 form-create">
        <Formik
        initialValues={{ name: '', category: '', image: '', description: '' }}
        validate={this._validate}
        onSubmit={(values, { setSubmitting }) => this._submitForm(values, { setSubmitting })}>
          {({ isSubmitting, values, }) => (
            <Form noValidate>
              <h1 className="h3 mb-3 text-center text-uppercase">Create New Animal</h1>
              <div className="form-row">
                <div className="col-md-4">
                  <ErrorMessage name="name" component="div" className="error" />
                </div>
                <div className="col-md-4">
                  <ErrorMessage name="category" component="div" className="error" />
                </div>
                <div className="col-md-4">
                  <ErrorMessage name="image" component="div" className="error" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <Field type="text" id="inputName" className="form-control" placeholder="Tommy" name="name" maxLength="12" />
                </div>
                <div className="form-group col-md-4">
                  <Field type="text" id="inputCategory" className="form-control" placeholder="Bear" name="category" maxLength="12" />
                </div>
                <div className="form-group col-md-4">
                  <Field type="text" id="inputImage" className="form-control" placeholder="Image URL" name="image" />
                </div>
              </div>
              <ErrorMessage name="description" component="div" className="error" />
              <Field id="inputDescription" className="form-control" placeholder="Description" name="description" rows="4" style={{resize: "none"}} maxLength={maxChar} component={InputTextArea}/>
              <button 
                type="submit" 
                className="btn btn-block btn-primary text-uppercase mt-3"
                disabled={isSubmitting || Object.values(values).includes("")}>
                  {`Create${isSubmitting?'ing':''}`}
              </button>
            </Form>)}
          </Formik>
        </main>
    )
  }  
}

export default Addanimal;