import React from 'react'
import { Link, } from 'react-router-dom'
import { timeAgo, } from '../utils/helper'
import { default as Edit } from '../assets/svg/edit.svg'
import { default as Delete } from '../assets/svg/delete.svg'

export default function Card({ animal, handleDelete }){

  const handleError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://dummyimage.com/600x400/000/ffffff&text=Image+not+found+on+Server"
  }
  return (
    <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-3">
      <div className="card mb-4">
      <img crossOrigin="anonymous" src={animal.image} onError={e => handleError(e)} className="card-img-top img img-fluid" alt={animal.image} />
        <div className="card-body">
          <h4 className="col-12 d-inline-block text-truncate font-weight-bold p-0 m-0">{animal.name}</h4>
          <h6 className="creator small">{animal.submittedBy && animal.submittedBy.name} &#8728; {timeAgo(animal.createdAt)}</h6>
          <p className="card-text">{animal.description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Link to={`/add/${animal._id}`} className="btn btn-sm btn-outline-info">
                <img src={Edit} alt="edit" />
              </Link>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(animal._id)}>
                <img src={Delete} alt="delete" />
              </button>
            </div>
            <span className="badge badge-primary p-2 col-5 d-inline-block text-truncate">{animal.category}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
