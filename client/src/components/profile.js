import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { capitalize } from 'lodash';
import { Card, Loader } from '../containers';
import { alertInfo, protectEmail } from '../utils/helper';
import { Avatar } from '../assets/svg';

const BASE_URL = '/api/v1/auth';

class Profile extends React.Component {
  state = {
    user: {},
    posts: [],
    loading: false,
  }

  componentDidMount() {
    this._getProfile();
  }

  _getProfile = (current_page) => {
    const { animals } = this.state;
    const { location } = this.props;
    let user_id;
    if (location.state === undefined) {
      user_id = JSON.parse(localStorage.getItem('user')).id;
    } else {
      user_id = location.state && location.state.user_id;
    }
    this.setState({ loading: true });
    axios.get(!current_page
      ? `${BASE_URL}/${user_id}`
      : `${BASE_URL}&currentPage=${current_page}`,
    { headers: { token: localStorage.getItem('token') } })
      .then((res) => res.data)
      .then((data) => {
        this.setState({ loading: false });
        if (!current_page) {
          this.setState({
            user: {
              id: data.data._id,
              username: data.data.username,
              email: data.data.email,
              firstname: capitalize(data.data.firstname),
              lastname: capitalize(data.data.lastname),
              bio: data.data.bio,
              image: data.data.image,
            },
            posts: data.data.posts,
          }, () => alertInfo('success', 'User fetched successfully'));
        } else {
          this.setState({
            animals: [...animals, ...data.data],
            pagination: data.pagination,
          }, () => alertInfo('success', 'User fetched successfully'));
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        alertInfo('error', err.response.data.message);
      });
  }

  render() {
    const { user, posts, loading } = this.state;
    const { location } = this.props;
    if (loading) {
      return <Loader fullpage />;
    }
    return (
      <div className="profile py-5 bg-light">
        <div className="container">
          <div className="user-section py-3">
            <div className="user-section-block">
              <div className="user-image">
                <img
                  crossOrigin="anonymous"
                  src={user && user.image && user.image !== '' && user.image !== 'undefined' ? user.image : Avatar}
                  alt="user"
                  className="img"
                />
              </div>
              <div className="user-details-block">
                <div className="user-details">
                  {user.firstname
                    && (
                      <p className="user-name">
                        {`${(user.firstname)} ${(user.lastname)}` || 'User Name'}
                      </p>
                    )}
                  <p className={`${user.firstname === '' ? 'user-name text-lowercase' : 'user-bio'}`}>
                    {`@${user.username}`}
                  </p>
                  <p className="user-bio">{user.email && protectEmail(user.email)}</p>
                  <p className="user-bio">{user.bio || 'Please update your bio' }</p>
                </div>
                {location.state === undefined
                  && (
                    <div className="edit-profile-block">
                      <Link to="/updateprofile" className="btn btn-primary btn-sm">Edit Profile</Link>
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="stats-section py-3">
            <div className="d-flex align-items-center">
              <div className="col-4">
                <div className="stats">
                  <h6 className="stats-num">{(posts && posts.length) || 0}</h6>
                  <p className="stats-type">{`${posts.length < 2 ? 'post' : 'posts'}`}</p>
                </div>
              </div>
              <div className="col-4">
                <div className="stats">
                  <h6 className="stats-num">123</h6>
                  <p className="stats-type">followers</p>
                </div>
              </div>
              <div className="col-4">
                <div className="stats">
                  <h6 className="stats-num">321</h6>
                  <p className="stats-type">following</p>
                </div>
              </div>
            </div>
          </div>
          <hr />
          {posts.length > 0
            && (
              <div className="posts-section py-3">
                <div className="row">
                  {posts.map((post) => (
                    <Card
                      type="profile"
                      key={post._id}
                      id={post._id}
                      name={post.name}
                      description={post.description}
                      category={post.category}
                      image={post.image}
                      createdAt={post.createdAt}
                      handleDelete={(id) => this._deleteAnimal(id)}
                      showEditAndDeleteBtn={location.state === undefined}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default Profile;
