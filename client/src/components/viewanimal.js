import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { alertInfo, timeAgo } from '../utils/helper';
import { Avatar } from '../assets/svg';

const BASE_URL = '/api/v1/animals';
const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : '';

class ViewAnimal extends React.Component {
  state = {
    post: {},
  }

  componentDidMount() {
    this._getPost();
  }

  _getPost = () => {
    const { match } = this.props;
    const { id } = match.params;
    axios.get(`${BASE_URL}/${id}`, { headers: { token: localStorage.getItem('token') } })
      .then((res) => res.data)
      .then((data) => {
        if (!data.error) {
          this.setState({
            post: {
              id: data.data._id,
              name: data.data.name,
              category: data.data.category,
              image: data.data.image,
              description: data.data.description,
              likesCount: data.data.likesCount,
              likes: data.data.likes,
              createdAt: data.data.createdAt,
              submittedBy: data.data.submittedBy,
            },
          }, () => alertInfo('success', 'Animal fetched successfully'));
        }
      })
      .catch((err) => {
        alertInfo('error', err.response.data.message);
      });
  }

  _isLiked = () => {
    const { post } = this.state;
    if (post && post.likes === []) return 'btn-outline-danger';
    return post && post.likes && post.likes.some((user) => user._id === user_id) ? 'btn-danger' : 'btn-outline-danger';
  }

  render() {
    const { post } = this.state;
    return (
      <main className="container py-5 view d-flex-center">
        <div className="card shadow-lg">
          <div className="post-header">
            <div className="post-details">
              <h6 className="post-name mb-0">{post.name}</h6>
              <div className="d-flex align-items-center">
                <p className="badge badge-primary p-1 post-category mb-0">{post.category}</p>
                &#8728;
                <p className="post-time mb-0 text-muted small">{timeAgo(post.createdAt)}</p>
              </div>
            </div>
            <Link
              to={{
                pathname: '/profile',
                state: {
                  user_id: post.submittedBy && post.submittedBy._id,
                },
              }}
              className="user-image cursor-pointer"
              data-tooltip={post.submittedBy && post.submittedBy.username}
              data-tooltip-location="bottom"
            >
              <img
                crossOrigin="anonymous"
                src={post.submittedBy && post.submittedBy.image !== '' ? post.submittedBy.image : Avatar}
                alt="user"
                className="img"
              />
            </Link>
          </div>
          <div className="post-image">
            <img
              src={post.image}
              alt="post-img"
              className="img card-img-top"
            />
          </div>
          <div className="post-description">{post.description}</div>
          <div className="action-buttons">
            <a
              href="#!"
              role="button"
              id={post.id}
              className={`btn btn-heart ${this._isLiked()}`}
              data-tooltip={`${this._isLiked() === 'btn-danger' ? 'Unlike' : 'Like'}`}
              data-tooltip-location="bottom"
            >
              <svg width="0.75em" height="0.75em" viewBox="0 0 16 16" className="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
              </svg>
              <span className="ml-1">{post.likesCount}</span>
            </a>
            <a
              href="#!"
              role="button"
              className="btn btn-heart btn-outline-info ml-1"
              data-tooltip="Share"
              data-tooltip-location="bottom"
            >
              <svg width="0.75em" height="0.75em" viewBox="0 0 16 16" className="bi bi-share" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
              </svg>
            </a>
          </div>
          <div className="list-persons" />
        </div>
      </main>
    );
  }
}

export default ViewAnimal;
