import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { debounce, throttle } from 'lodash';
import { alertInfo, isAuthenticated } from '../utils/helper';
import { Card, InputSearch } from '../containers';

const BASE_URL = '/api/v1/animals';

class Main extends React.Component {
  state = {
    animals: [],
    pagination: {},
    searchVal: '',
    searchValError: '',
    current_page: 1,
  };

  _debouncedGetData = debounce(() => {
    this._getData();
  }, 800, { maxWait: 1000 });

  componentDidMount() {
    this._getData();
    window.addEventListener('scroll', throttle(this._handleScroll, 600), { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll);
  }

  _handleScroll = () => {
    const { current_page, pagination } = this.state;
    // Infinite Scrolling Logic
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
      if ((current_page < pagination.last_page)) {
        this.setState({ current_page: current_page + 1 }, () => this._getData(current_page));
      }
    }
    // Scroll-to-top Logic
    const btn = document.getElementById('scroll-top');
    if (document.documentElement.scrollTop > 600) {
      btn.style.opacity = 1;
    } else {
      btn.style.opacity = 0;
    }
  }

  _handleChange = (e) => {
    const val = e.target.value;
    const { searchVal } = this.state;
    if (/(^\s+|\s+$)/g.test(val)) {
      return this.setState({ searchValError: 'Can\'t have spaces at start or end.' });
    }
    return this.setState({ searchVal: val }, () => {
      if (searchVal.length === 0 || searchVal.length > 2) {
        this.setState({ searchValError: '' });
        this._debouncedGetData();
      } else if (searchVal.length > 0 || searchVal.length < 3) {
        this.setState({ searchValError: 'Please type atleast 3 words to search.' });
      }
    });
  }

  _getData = (current_page) => {
    const { animals, searchVal } = this.state;
    axios.get(!current_page
      ? `${BASE_URL}?search=${searchVal}`
      : `${BASE_URL}?search=${searchVal}&currentPage=${current_page}`,
    { headers: { token: localStorage.getItem('token') } })
      .then((res) => res.data)
      .then((data) => {
        if (!data.error) {
          if (!current_page) {
            this.setState({ animals: data.data, pagination: data.pagination },
              () => alertInfo('success', 'Data fetched successfully'));
          } else {
            this.setState({ animals: [...animals, ...data.data], pagination: data.pagination }, () => alertInfo('success', 'Data fetched successfully'));
          }
        }
      })
      .catch((err) => alertInfo('error', err.response.data.message));
  }

  _deleteAnimal = (id) => {
    const { animals } = this.state;
    axios.delete(`${BASE_URL}/${id}`, { headers: { token: localStorage.getItem('token') } })
      .then((res) => {
        if (!res.data.error) {
          this.setState({ animals: animals.filter((animal) => animal._id !== id) }, () => alertInfo('success', 'Data fetched successfully'));
        }
      })
      .catch((err) => {
        console.log('err.response', err.response);
        alertInfo('error', 'Could not delete animal');
      });
  }

  _toggleLike = (id) => {
    axios.get(`${BASE_URL}/${id}/togglelike`, { headers: { token: localStorage.getItem('token') } })
      .then((res) => res.data)
      .then((data) => {
        if (!data.error) {
          const animal_id = document.getElementById(data.data._id);
          if (!data.data.likes.includes(JSON.parse(localStorage.getItem('user')).id)) {
            animal_id.classList.remove('btn-danger');
            animal_id.classList.add('btn-outline-danger');
          } else {
            animal_id.classList.add('btn-danger');
            animal_id.classList.remove('btn-outline-danger');
          }
          animal_id.lastElementChild.innerHTML = data.data.likesCount;
          return alertInfo('success', 'Toggled post');
        }
      })
      .catch(() => alertInfo('error', 'Could not toggle Like'));
  }

  render() {
    const { animals, searchVal, searchValError } = this.state;
    if (!isAuthenticated()) {
      return <Redirect to="/login" />;
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
              {animals.length === 0
                && (
                  <div className="col-12 d-flex flex-column align-items-center justify-content-center">
                    <img src="../assets/svg/no-data.svg" alt="no-data" className="img img-fluid" width="400" />
                    <p className="no-data-text">Oops!! No Animals here!</p>
                  </div>
                )}
              {animals.length > 0 && animals.map((animal) => (
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
                  likes={animal.likes}
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
