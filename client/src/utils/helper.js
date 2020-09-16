import axios from 'axios'
import { Notyf } from 'notyf';

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

export { 
  setAuthToken, alertInfo, isAutheticated
}