import React from 'react';

export default function Loader({ fullpage }) {
  return (
    <div className={`${fullpage ? 'vw-100 vh-100 d-flex-center' : ''}`}>
      <div className="spinner">
        <div className="spinner-item" />
        <div className="spinner-item" />
        <div className="spinner-item" />
        <div className="spinner-item" />
        <div className="spinner-item" />
      </div>
    </div>
  );
}
