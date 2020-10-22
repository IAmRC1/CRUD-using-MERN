import React from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/helper';
import { Edit, Delete } from '../assets/svg';

const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : '';

class Card extends React.Component {
  _handleError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://dummyimage.com/600x400/000/ffffff&text=Image+not+found+on+Server';
  };

  render() {
    const {
      // eslint-disable-next-line max-len
      id, image, name, type, submittedByID, submittedBy, createdAt, description, showEditAndDeleteBtn, handleDelete, likes, toggleLike, likesCount, category,
    } = this.props;
    return (
      <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-3">
        <div className="card mb-4">
          <Link to={`view/${id}`}>
            <img
              crossOrigin="anonymous"
              src={image}
              onError={(e) => this._handleError(e)}
              className="card-img-top img img-fluid"
              alt={image}
            />
          </Link>
          <div className="card-body">
            <h4 className="col-12 d-inline-block text-truncate font-weight-bold p-0 m-0">{name}</h4>
            {type === 'home'
              && (
                <h6 className="creator small">
                  <Link
                    to={{
                      pathname: '/profile',
                      state: {
                        user_id: submittedByID,
                      },
                    }}
                    className={submittedBy === JSON.parse(localStorage.getItem('user')).username
                      ? 'text-reset' : ''}
                    style={{ pointerEvents: submittedBy === JSON.parse(localStorage.getItem('user')).username ? 'none' : 'auto' }}
                  >
                    {`@${submittedBy}`}
                  </Link>
                  ∘
                  {timeAgo(createdAt)}
                </h6>
              )}
            {type === 'profile'
              && <h6 className="creator small">{timeAgo(createdAt)}</h6>}
            <p className="card-text">{description}</p>
            <div className="d-flex align-items-center justify-content-between">
              {showEditAndDeleteBtn
                && (
                  <div className="btn-group">
                    <Link to={`edit/${id}`} className="btn btn-sm btn-outline-info">
                      <img src={Edit} alt="edit" />
                    </Link>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(id)}>
                      <img src={Delete} alt="delete" />
                    </button>
                  </div>
                )}
              {!showEditAndDeleteBtn && type === 'home'
                && (
                  <a
                    href="#!"
                    role="button"
                    id={id}
                    className={`btn btn-heart ${type === 'home' && likes.includes(user_id) ? 'btn-danger' : 'btn-outline-danger'}`}
                    data-tooltip={`${type === 'home' && likes.includes(user_id) ? 'Unlike' : 'Like'}`}
                    data-tooltip-location="bottom"
                    onClick={() => toggleLike(id)}
                  >
                    <svg width="0.75em" height="0.75em" viewBox="0 0 16 16" className="bi bi-heart" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                    </svg>
                    <span className="ml-1">{likesCount}</span>
                  </a>
                )}
              <span className="badge badge-primary p-2 col-5 d-inline-block text-truncate">{category}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
