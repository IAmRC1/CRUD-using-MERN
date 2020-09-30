import React from 'react'

export default function InputSearch({ searchVal, searchValError, handleChange }) {
  
  return (
    <div className={`${searchValError.length < 3 ? "d-flex flex-column align-items-start py-3" : "pb-3"}`}>
      {searchValError && <p className="error mb-0 w-100 w-md-50 ml-auto">{searchValError}</p>}
      <div className="input-group w-100 w-md-50 ml-auto">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search Animals by Name" 
          name="searchVal"
          maxLength="20"
          value={searchVal}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}