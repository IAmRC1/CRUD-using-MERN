import React from 'react'
import { Redirect, } from 'react-router-dom'
import axios from 'axios'
import { alertInfo, isAuthenticated, } from '../utils/helper'
import { Card, InputSearch, } from '../containers'
import { debounce, throttle } from 'lodash'

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

  _handleChange = e => {
    const val = e.target.value;
    if(/(^\s+|\s+$)/g.test(val)){
      return this.setState({ searchValError: "Can't have spaces at start or end."})
    }
    this.setState({ searchVal: val }, () => {
      if(this.state.searchVal.length === 0 || this.state.searchVal.length > 2){
        this.setState({ searchValError: "" });
        this._debouncedGetData();
      } else if(this.state.searchVal.length > 0 || this.state.searchVal.length < 3) {
        this.setState({ searchValError: "Please type atleast 3 words to search."})
      }
    })
  }

  _debouncedGetData = debounce(() => {
    this._getData()
  }, 800, { 'maxWait': 1000 });

  _getData = (current_page) => {
    if(isAuthenticated()){
      axios.get(!current_page?
        `${BASE_URL}?search=${this.state.searchVal}`:
        `${BASE_URL}?search=${this.state.searchVal}&currentPage=${current_page}`, 
        { headers: { 'token': localStorage.getItem('token') }})
        .then(res => res.data)
        .then(data => {
          if(!data.error){
            if(!current_page){
              this.setState({ animals: data.data, pagination: data.pagination },
                () => alertInfo('success', 'Data fetched successfully'))
            } else {
              this.setState({ animals: [...this.state.animals, ...data.data], pagination: data.pagination }, () => alertInfo('success', 'Data fetched successfully'))
            }
          }
        })
        .catch(err => {
          alertInfo('error', err.response.data.message)
        });
    }
  }

  _deleteAnimal = (id) => {
    axios.delete(`/api/v1/animals/${id}`, { headers: { 'token' : localStorage.getItem('token') }})
    .then(res => {
      if(!res.data.error){
        this.setState({ animals: this.state.animals.filter(animal => animal._id !== id) }, () => {
          return alertInfo('success', 'Data fetched successfully');
        })
      }
    })
    .catch(err => alertInfo('error', 'Could not delete animal'))
  }

  _toggleLike = (id) => {
    console.log('object', id)
  }

  render() {
    const { animals, searchVal, searchValError } = this.state;
    if(!isAuthenticated()){
      return <Redirect to="/login" />
    }
    return (
      <main>
        <div className="album py-5 bg-light">
          <div className="container">
            <InputSearch 
              searchVal={searchVal}
              searchValError={searchValError}
              handleChange={this._handleChange}
            />
            <div className="row">
              {animals.length === 0 && 
                <div className="col-12 d-flex flex-column align-items-center justify-content-center">
                  <img src={require("../assets/svg/no-data.svg")} alt="no-data" className="img img-fluid" width="400" />
                  <p className="no-data-text">Oops!! No Animals here!</p> 
                </div>
              } 
              {animals.length > 0 && animals.map(animal => (
                <Card 
                  type="home"
                  key={animal._id}
                  id={animal._id}
                  name={animal.name}
                  description={animal.description}
                  category={animal.category}
                  image={animal.image}
                  submittedBy={animal.submittedBy && animal.submittedBy.username}
                  submittedByID={animal.submittedBy && animal.submittedBy._id}
                  createdAt={animal.createdAt}
                  handleDelete={(id) => this._deleteAnimal(id)}
                  showEditAndDeleteBtn={false}
                  likesCount={animal.likesCount}
                  toggleLike={(id) => this._toggleLike(id)}
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
