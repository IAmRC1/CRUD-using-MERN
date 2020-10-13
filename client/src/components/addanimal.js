import React from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { alertInfo, isAuthenticated, inputTextArea, inputFile } from '../utils/helper'
import { Formik, Form, Field, ErrorMessage } from 'formik';

const maxChar = 250;

class AddAnimal extends React.Component {

  state = {
    label: "Select Image",
  }

  _validate = (values) => {
    const minSize = 50 * 1024; // 100 kb
    const maxSize = 2 * (1024 ** 2); // 2 mb
    const mimeType = "image/jpeg, image/jpg, image/png"
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    } else if(/(^\s+|\s+$)/g.test(values.name)){
      errors.name = 'Spaces not allowed at the start/end';
    } else if (values.name.length < 3) {
      errors.name = 'Name must be 3-20 chars long.';
    } else if (!values.category) {
      errors.category = 'Category is required';
    } else if(/(^\s+|\s+$)/g.test(values.category)){
      errors.category = 'Spaces not allowed at the start/end';
    } else if (values.category.length < 3) {
      errors.category = 'Category must be 3-20 chars long.';
    } else if (!values.description) {
      errors.description = 'Description is required';
    } else if(/(^\s+|\s+$)/g.test(values.description)){
      errors.description = 'Spaces not allowed at the start/end';
    } else if (values.description.length < 30) {
      errors.description = `Description must be 30-${maxChar} chars long.`;
    } else if(!values.image){
      errors.image = 'Image is required'
    } else if (values.image) {
      let file = values.image;
      if (!mimeType.includes(file.type)) {
        errors.image=`Extension must be jpg, jpeg, png`;
      } else if (file.size < minSize) {
        errors.image = 'Uploaded file must be atleast 50KB';
      } else if (file.size > maxSize) {
        errors.image = 'Uploaded file cannot exceed 2MB size';
      }
    }
    return errors;
  }

  _handleFileUpload = (e, {setFieldValue }) => {
    if(e.target.files){
      setFieldValue("image", e.target.files[0]) 
      this.setState({ label: e.target.files[0].name })
    }
  }
  _removeFile = (e, {setFieldValue }) => {
    setFieldValue("image", "") 
    this.setState({ label: "Select Image" })
  }

  _submitForm = (values, { setSubmitting }) => {
    const animal = new FormData();
    animal.append('name', values.name)
    animal.append('category', values.category)
    animal.append('image', values.image)
    animal.append('description', values.description)
    axios.post('/api/v1/animals', animal,
    { headers: { 'token' : localStorage.getItem('token') }})
    .then(res => res.data)
    .then(data => {
      if(!data.error){
        //alertInfo('success', 'Animal created successfully')
        setSubmitting(false);
        return this.props.history.push('/home')
      }
    })
    .catch(err => {
      setSubmitting(false);
      const { errors } = err.response.data
      errors.map(err => {
        const keys = Object.keys(err)
        return alertInfo('error', err[keys])
      })
    })
  }

  

  render(){
    if(!isAuthenticated()){
      return <Redirect to="/login" />
    }
    return (
      <main className="container py-5 form-create">
        <Formik
        initialValues={{ name: '', category: '', image: '', description: '' }}
        validate={this._validate}
        onSubmit={(values, { setSubmitting }) => this._submitForm(values, { setSubmitting })}>
          {({ isSubmitting, values, setFieldValue }) => (
            <Form noValidate>
              <h1 className="h3 mb-3 text-center text-uppercase">Create New Animal</h1>
              <div className="form-row">
                <div className="form-group col-xs-12 col-lg-4">
                  <Field type="text" id="inputName" className="form-control" placeholder="Tommy" name="name" maxLength="20" />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>
                <div className="form-group col-xs-12 col-lg-4">
                  <Field type="text" id="inputCategory" className="form-control" placeholder="Bear" name="category" maxLength="20" />
                  <ErrorMessage name="category" component="div" className="error" />
                </div>
                <div className="form-group col-xs-12 col-lg-4">
                  <Field 
                    name="image"
                    handleChange={e => this._handleFileUpload(e, {setFieldValue})}
                    removeFile={e => this._removeFile(e, {setFieldValue})}
                    label={this.state.label}
                    component={inputFile} />
                  <ErrorMessage name="image" component="div" className="error" />
                </div>
              </div>
              <ErrorMessage name="description" component="div" className="error" />
              <Field id="inputDescription" className="form-control" placeholder="Description" name="description" rows="4" style={{resize: "none"}} maxLength={maxChar} component={inputTextArea} />
              <button 
                type="submit" 
                className="btn btn-block btn-primary text-uppercase mt-3"
                disabled={isSubmitting || Object.values(values).includes("")}>
                  {`Creat${isSubmitting?'ing':'e'}`}
              </button>
            </Form>
          )}
          </Formik>
        </main>
    )
  }  
}

export default AddAnimal;