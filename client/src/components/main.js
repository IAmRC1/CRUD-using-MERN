import React from 'react'
import { Redirect, } from 'react-router-dom'
import axios from 'axios'
import { alertInfo, isAutheticated, } from '../utils/helper'
import { Card, ScrollToTop, } from '../containers'
import { debounce, throttle } from 'lodash'

const token = localStorage.getItem('token')
const BASE_URL = "/api/v1/animals"

class Main extends React.Component {

  state = {
    animals: [],
    pagination: {},
    searchVal: "",
    searchValError: "",
    current_page: 1,
  };

  componentDidMount() {
    this._getData();
    window.addEventListener('scroll', throttle(this._handleScroll, 600), { passive: true })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll)
  }

  _handleScroll = () => {
    // Infinite Scrolling Logic
    if(window.scrollY + window.innerHeight >= document.body.offsetHeight){
      if((this.state.current_page < this.state.pagination.last_page)){
        this.setState({ current_page: this.state.current_page + 1 }, () => this._getData(this.state.current_page));
      }
    }
    // Scroll-to-top Logic
    const btn = document.getElementById('scroll-top');
    if(document.documentElement.scrollTop > 600){
      btn.style.opacity = 1;
    } else {
      btn.style.opacity = 0;
    }
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

  _getData = (current_page) => {
    if(isAutheticated()){
      axios.get(!current_page?
        `${BASE_URL}?search=${this.state.searchVal}`:
        `${BASE_URL}?search=${this.state.searchVal}&currentPage=${current_page}`, 
        { headers: { 'token': token }})
        .then(res => res.data)
        .then(data => {
          if(!data.error){
            this.setState({ animals: [...this.state.animals, ...data.data], pagination: data.pagination }, () => {
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
        <ScrollToTop />
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
          </div>
        </div>
      </main>
    );
  }
}

export default Main;
