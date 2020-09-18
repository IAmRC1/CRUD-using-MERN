import React from 'react'
import axios from 'axios'
import { Notyf } from 'notyf';
import TimeAgo from 'react-timeago'

const notyf = new Notyf({ duration: 3000, position: { x:'right', y:'top' }});

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

const alertInfo = (type, message) => {
  switch(type){
    case 'success':
      return notyf.success(message);
    case 'error':
      return notyf.error(message);
    default:
    return;
  }
}

const isAutheticated = () => window.localStorage.getItem('token') ? true : false;

const timeAgo = (date) => <TimeAgo date={Date.parse(date)} minPeriod="5" />

const inputTextArea = ({ field, form, ...props }) => (
  <React.Fragment>
    <textarea {...field} {...props} ></textarea>
    <p className="text-right text-muted small m-0">{field.value.length}/{props.maxLength}</p>
  </React.Fragment>
);

const inputFile = ({ field, form, ...props }) => (
  <div className="input-group">
    <div className="custom-file">
      <input type="file" className="custom-file-input cursor-pointer" id="customFile" onChange={props.handleChange} />
      <label className={`custom-file-label ${props.label.includes('.') ? "image-label" : ""}`} htmlFor="customFile" data-browse="Browse">{props.label}</label>
    </div>
    <div className="input-group-append">
      <button className="btn btn-secondary" type="button" onClick={props.removeFile} disabled={!field.value} style={{ color: "#495057", backgroundColor: "#e9ecef", borderColor: "rgb(206, 212, 218)" }}>Reset</button>
    </div>
  </div>
)

export { 
  setAuthToken, alertInfo, isAutheticated, timeAgo, inputTextArea, inputFile,
}
