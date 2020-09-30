import React from 'react'
import { Link, } from 'react-router-dom'
import { timeAgo, } from '../utils/helper'
import { Edit, Delete, Heart } from '../assets/svg'

export default function Card(props){
  const handleError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://dummyimage.com/600x400/000/ffffff&text=Image+not+found+on+Server"
  }
  return (
    <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-3">
      <div className="card mb-4">
        <Link to={`view/${props.id}`}>
          <img 
            crossOrigin="anonymous" 
            src={props.image} 
            onError={e => handleError(e)} 
            className="card-img-top img img-fluid" 
            alt={props.image} 
          />
        </Link>
        <div className="card-body">
          <h4 className="col-12 d-inline-block text-truncate font-weight-bold p-0 m-0">{props.name}</h4>
          {props.type === "home" && 
            <h6 className="creator small">
              <Link 
                to={{ 
                  pathname: "/profile",
                  state: {
                    user_id: props.submittedByID
                  }
                }} className={props.submittedBy === JSON.parse(localStorage.getItem("user")).username
                  ? "text-reset"
                  : ""}>
                  {`@${props.submittedBy}`}
              </Link> 
              &#8728; 
              {timeAgo(props.createdAt)}
            </h6>
          }
          {props.type === "profile" && 
            <h6 className="creator small">{timeAgo(props.createdAt)}</h6>
          }
          <p className="card-text">{props.description}</p>
          <div className="d-flex align-items-center justify-content-between">
            {props.showEditAndDeleteBtn && 
              <div className="btn-group">
                <Link to={`edit/${props.id}`} className="btn btn-sm btn-outline-info">
                  <img src={Edit} alt="edit" />
                </Link>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => props.handleDelete(props.id)}>
                  <img src={Delete} alt="delete" />
                </button>
              </div>
            }
            {!props.showEditAndDeleteBtn && <button className="btn btn-outline-danger btn-heart" onClick={() => props.toggleLike(props.id)}>
            <svg width="0.75em" height="0.75em" viewBox="0 0 16 16" className="bi bi-heart mr-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
            </svg>
              {props.likesCount}{props.likesCount < 2 ? " like" : " likes"}</button>}
            <span className="badge badge-primary p-2 col-5 d-inline-block text-truncate">{props.category}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
