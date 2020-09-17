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

export { 
  setAuthToken, alertInfo, isAutheticated, timeAgo, inputTextArea,
}
