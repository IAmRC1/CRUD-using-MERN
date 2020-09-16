import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { alertInfo, isAutheticated } from '../utils/helper'

const token = window.localStorage.getItem('token')

class Main extends React.Component {

  state = {
    animals: [],
    search: "qwe",
    type: ""
  };

  componentDidMount() {
    axios.get('/api/v1/animals', { headers: { 'token': token }})
      .then(res => res.data)
      .then(data => {
        if(!data.error){
          this.setState({ animals: data.data })
          return alertInfo('success', 'Data fetched successfully')
        }
      })
      .catch(err => alertInfo('error', err.response.data));
  }

  _deleteAnimal = (id) => {
    axios.delete(`/api/v1/animals/${id}`, { headers: { 'token' : token }})
    .then(res => {
      if(!res.data.error){
        this.setState({ animals: this.state.animals.filter(animal => animal._id !== id) }, () => {
          return alertInfo('success', 'Data fetched successfully');
        })
      }
    })
    .catch(err => alertInfo('error', 'Could not delete Animal'))
  }

  render() {
    if(!isAutheticated()){
      return <Redirect to="/login" />
    }
    return (
      <main>
        <div className="album py-5 bg-light">
          <div className="container">
            <div className="input-group w-100 w-md-50 py-3 ml-auto">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search" 
                name="search"
                value={this.state.search}
                onChange={this._handleChange}
              />
              <select className="custom-select" name="type" value={this.state.type} onChange={this._handleChange} >
                <option value="">Tag</option>
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="lion">Lion</option>
              </select>
            </div>
            <div className="row">
              {this.state.animals && this.state.animals.map(animal => (
                <div key={animal._id} className="col-xs-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="card mb-4">
                    <figure className="position-relative m-0">
                      <img src={require('../assets/images/yQUnPbU9sIg.jpg')} className="card-img-top img img-fluid" alt="animal" />
                      <h6 className="author m-0">{animal.submittedBy && animal.submittedBy.name}</h6>
                    </figure>
                    <div className="card-body">
                      <h4 className="col-12 d-inline-block text-truncate p-0 m-0">{animal.name}</h4>
                      <p className="card-text">{animal.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <Link to={`/add/${animal._id}`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => this._deleteAnimal(animal._id)}>Delete</button>
                        </div>
                        <span className="badge badge-info p-2 col-5 d-inline-block text-truncate">{animal.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Main;
