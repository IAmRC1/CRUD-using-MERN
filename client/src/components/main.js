import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Main extends React.Component {

  state = {
    animals: []
  };

  componentDidMount() {
    axios.get('/animals')
      .then(res => res.data)
      .then(data => {
        if(data.length){
          this.setState({
            animals: data
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

  render() {
    return (
      <main>
        <div className="album py-5 bg-light">
          <div className="container">
            <div className="row">
              {this.state.animals.map(animal => (
                <div key={animal._id} className="col-md-4">
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
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Main;
