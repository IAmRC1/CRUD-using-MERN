import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Main extends React.Component {

  state = {
    animals: [],
    search: "",
    filteredAnimals: [],
    type: ""
  };

  componentDidMount() {
    axios.get('/animals')
      .then(res => res.data)
      .then(data => {
        if(data.length){
          this.setState({
            animals: data,
            filteredAnimals: data
          })
        }
      })
      .catch(err => console.log('err', err))
  }

  _deleteAnimal = (id) => {
    axios.delete(`/animals/${id}`)
    .then(res => console.log(res.data))
    this.setState({
      animals: this.state.animals.filter(animal => animal._id !== id)
    })
  }

  _onSearch = (e) => {
    let filteredAnimals = this.state.animals.filter(animal => animal.name.toLowerCase().indexOf(e.target.value) !== -1)
    this.setState({
      search: e.target.value,
      filteredAnimals
    })
  }

  _handleType = e => {
    let filteredAnimals = this.state.animals.filter(animal => animal.type.toLowerCase().indexOf(e.target.value) !== -1);
    this.setState({
      type: e.target.value,
      filteredAnimals
    })
  }


  render() {
    const allAnimals = (
      (this.state.search === "" && this.state.type === "" ? this.state.animals : this.state.filteredAnimals).map(animal => (
        <div key={animal._id} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <div className="card mb-4 shadow-sm">
            <img src={animal.image} className="card-img-top" alt="animal" />
            <div className="card-body">
              <h4>{animal.name}</h4>
              <p className="card-text">{animal.description}</p>
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <Link to="#!" className="btn btn-sm btn-outline-primary">View</Link>
                  <Link to={`/update/${animal._id}`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => this._deleteAnimal(animal._id)}>Delete</button>
                </div>
                <span className="badge badge-info p-2">{animal.type}</span>
              </div>
            </div>
          </div>
        </div>
      ))
    )

    return (
      <main>
        <div className="album py-5 bg-light">
          <div className="container">
            <div className="input-group w-100 py-3 ml-auto">
              <input type="text" className="form-control" placeholder="Search by Name" onChange={this._onSearch} value={this.state.search} name="search" />
                <select className="custom-select" value={this.state.type} onChange={this._handleType} name="type">
                  <option value="">Search by Tag</option>
                  {this.state.animals
                    .map(animal => animal.type)
                    .filter((type, i, self) => self.indexOf(type) === i)
                    .map((type, i) => <option key={i} value={type}>{type}</option>)
                  }
                </select>
            </div>
            <div className="row">
              {allAnimals}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Main;
