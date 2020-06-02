import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

const Root = () => {
  return (
    <React.Fragment>
      <ReactNotification />
      <App/>
    </React.Fragment>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));