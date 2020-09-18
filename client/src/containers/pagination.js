import React from 'react'

export default function Pagination({ pagination }) {
  console.log('pagination', pagination)
  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className="page-item"><a className="page-link" href="#!">Previous</a></li>
        <li className="page-item"><a className="page-link" href="#!">1</a></li>
        <li className="page-item"><a className="page-link" href="#!">2</a></li>
        <li className="page-item"><a className="page-link" href="#!">3</a></li>
        <li className="page-item"><a className="page-link" href="#!">Next</a></li>
      </ul>
    </nav>
  )
}
