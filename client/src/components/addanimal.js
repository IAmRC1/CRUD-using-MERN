import React from 'react'
import axios from 'axios'

class Addanimal extends React.Component {

  state = {
    name: "",
    type: "",
    image: "",
    description: ""
  }

  _onChangeHandler = e => {
    this.setState({
      [e.target.name] : e.target.value
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
    axios.post('/animals/add', animal)
    window.location = '/';
  }


  render(){
    return (
      <main className="container">
        <form onSubmit={this._onSubmit}>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="inputName">Name</label>
              <input type="text" className="form-control" id="inputName" name="name" onChange={this._onChangeHandler} value={this.state.name} />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="inputType">Type</label>
              <input className="form-control" id="inputType" name="type" onChange={this._onChangeHandler} value={this.state.type} />
            </div>
            {/* <div className="form-group col-md-4">
              <label htmlFor="inputImage">Image</label>
              <input type="file" className="form-control" id="inputImage" />
            </div> */}
            <div className="form-group col-md-4">
              <label htmlFor="inputImage">Image</label>
              <input className="form-control" id="inputImage" name="image" onChange={this._onChangeHandler} value={this.state.image} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputDescription">Description</label>
            <input type="text" className="form-control" id="inputDescription" name="description" onChange={this._onChangeHandler} value={this.state.description} />
          </div>
          <button type="submit" className="btn btn-block btn-primary">CREATE</button>
        </form>
      </main>
    )
  }  
}

export default Addanimal;