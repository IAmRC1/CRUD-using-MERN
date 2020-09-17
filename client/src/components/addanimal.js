import React from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { alertInfo, isAutheticated, inputTextArea, } from '../utils/helper'
import { Formik, Form, Field, ErrorMessage } from 'formik';

const token = localStorage.getItem('token')

const maxChar = 250;

class Addanimal extends React.Component {

  _validate = (values) => {
    console.log('values', values)
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
    }
    //  else if (!values.image) {
    //   errors.image = 'Image is required';
    // } else if (values.image.type !== 'image/jpeg' || values.image.type !== 'image/jpg' || values.image.type !== 'image/png') {
    //   errors.image = 'Only jpg/jpeg/png are supported.';
    // }
     else if (!values.description) {
      errors.description = 'Description is required';
    } else if(/(^\s+|\s+$)/g.test(values.description)){
      errors.description = 'Spaces not allowed at the start/end';
    } else if (values.description.length < 30) {
      errors.description = `Description must be 30-${maxChar} chars long.`;
    }
    return errors;
  }

  _submitForm = (values, { setSubmitting }) => {
    const animal = new FormData();
    animal.append('name', values.name)
    animal.append('category', values.category)
    animal.append('image', values.image)
    animal.append('description', values.description)
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
      console.log('err.response', err.response)
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
        initialValues={{ name: '', category: '', image: null, description: '' }}
        validate={this._validate}
        onSubmit={(values, { setSubmitting }) => this._submitForm(values, { setSubmitting })}>
          {({ isSubmitting, values, setFieldValue }) => (
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
                  <Field type="text" id="inputName" className="form-control" placeholder="Tommy" name="name" maxLength="20" />
                </div>
                <div className="form-group col-md-4">
                  <Field type="text" id="inputCategory" className="form-control" placeholder="Bear" name="category" maxLength="20" />
                </div>
                <div className="form-group col-md-4">
                  <div className="custom-file">
                    <input type="file" id="inputImage" className="form-control custom-file-input cursor-pointer" name="image" accept="image/*" onChange={e => setFieldValue("image", e.target.files[0])} />
                    <label className="custom-file-label">Choose file</label>
                  </div>
                </div>
              </div>
              <ErrorMessage name="description" component="div" className="error" />
              <Field id="inputDescription" className="form-control" placeholder="Description" name="description" rows="4" style={{resize: "none"}} maxLength={maxChar} component={inputTextArea}/>
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