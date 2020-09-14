import axios from 'axios'
import { Notyf } from 'notyf';

const notyf = new Notyf({ duration: 3000, position: {x:'right',y:'top'}});

export const setAuthToken = (token) => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const alertInfo = (type, message) => {
  switch(type){
    case 'success':
      return notyf.success(message);
    case 'error':
      return notyf.error(message);
  }
}
