/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';
import { QuestionCircle } from '../assets/svg';

export default function NotFound() {
  return (
    <div className="not-found my-5 pt-5">
      <h1 className="text-center d-flex-center display-4">
        4
        <img src={QuestionCircle} alt="ques" className="img ques-circle" />
        4
      </h1>
      <h1 className="text-center h3">
        Maybe this page moved?
        <br />
        Got deleted? Is hiding out in quarantine?
        <br />
        Never existed in the first place?
        <br />
        Let&apos;s go
        <Link to="/home"> home </Link>
        and try from there.
      </h1>
    </div>
  );
}
