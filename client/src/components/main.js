import React from 'react'
import { Redirect, } from 'react-router-dom'
import axios from 'axios'
import { alertInfo, isAutheticated, } from '../utils/helper'
import { Card, Pagination, } from '../containers'
import { debounce } from 'lodash'

const token = localStorage.getItem('token')

class Main extends React.Component {

  state = {
    animals: [],
    searchVal: "",
    searchValError: ""
  };

  componentDidMount() {
    this._getData();
  }

  _handleChange = debounce(searchVal => {
    this.setState({ searchVal }, () => {
      if(this.state.searchVal.length === 0 || this.state.searchVal.length > 2){
        this.setState({ searchValError: "" });
        this._getData();
      } else if(this.state.searchVal.length > 0 || this.state.searchVal.length < 3) {
        this.setState({ searchValError: "Please type atleast 3 words to search."})
      }
    })
  }, 600, { maxWait: 1000 });

  _getData = () => {
    if(isAutheticated()){    
      axios.get(`/api/v1/animals?search=${this.state.searchVal}`, { headers: { 'token': token }})
        .then(res => res.data)
        .then(data => {
          if(!data.error){
            this.setState({ animals: data.data }, () => {
              return alertInfo('success', 'Data fetched successfully')
            })
          }
        })
        .catch(err => alertInfo('error', err.response.data.message));
    }
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
    .catch(err => alertInfo('error', 'Could not delete animal'))
  }

  render() {
    const { animals, searchVal, searchValError } = this.state;
    if(token === null){
      return <Redirect to="/register" />
    } else if(!isAutheticated()){
      return <Redirect to="/login" />
    }
    return (
      <main>
        <div className="album py-5 bg-light">
          <div className="container">
            <div className={`${searchValError.length < 3 ? "d-flex flex-column align-items-start py-3" : "pb-3"}`}>
              {searchValError && <p className="error mb-0">{searchValError}</p>}
              <div className="input-group w-100 w-md-50 ml-auto">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search Animals" 
                  name="searchVal"
                  maxLength="15"
                  value={searchVal}
                  onChange={e => this._handleChange(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              {animals && animals.map(animal => (
                <Card 
                  key={animal._id} 
                  animal={animal} 
                  handleDelete={(id) => this._deleteAnimal(id)}
                />
              ))}
            </div>
            <Pagination />
          </div>
        </div>
      </main>
    );
  }
}

export default Main;
