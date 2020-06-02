import React from 'react'
import axios from 'axios'
import bsCustomFileInput from 'bs-custom-file-input';

const token = localStorage.getItem('x-auth-token')

class Addanimal extends React.Component {

  state = {
    name: "",
    type: "",
    image: "",
    description: ""
  }

  componentDidMount(){
    bsCustomFileInput.init()
  }

  _onChangeHandler = e => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  _handleType = e => {
    this.setState({
      type: e.target.value
    })
  }

  _onSubmit = e => {
    e.preventDefault();
    const animal = {
      name: this.state.name,
      type: this.state.type,
      image: this.state.image,
      description: this.state.description,
    }
    axios.post('/animals/add', animal, { headers: { 'x-auth-token' : token }})
    window.location = '/main';
  }


  render(){
    return (
      <main className="container py-5">
        <form onSubmit={this._onSubmit}>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="inputName">Name</label>
              <input required type="text" className="form-control" id="inputName" name="name" onChange={this._onChangeHandler} value={this.state.name} />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="inputType">Type</label>
              <select className="custom-select" id="inputType" value={this.state.type} onChange={this._handleType}>
                <option value="" disabled>Type of animal</option>
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="bear">Bear</option>
                <option value="lion">Lion</option>
              </select>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="inputImage">Image</label>
              <input required type="text" className="form-control" id="inputImage" name="image" onChange={this._onChangeHandler} value={this.state.image} />
            </div>

            {/* <div className="form-group col-md-4">
              <label htmlFor="inputImage">Image</label>
              <div className="custom-file">
                <input required type="file" className="custom-file-input form-control" id="inputImage" name="image" onChange={this._onChangeHandlerImage} accept="image/*" />
                <label className="custom-file-label">Choose file</label>
              </div>
            </div> */}
          </div>
          <div className="form-group">
            <label htmlFor="inputDescription">Description</label>
            <input required type="text" className="form-control" id="inputDescription" name="description" onChange={this._onChangeHandler} value={this.state.description} />
          </div>
          <button type="submit" className="btn btn-block btn-primary">CREATE</button>
        </form>
      </main>
    )
  }  
}

export default Addanimal;