/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Notyf } from 'notyf';
import TimeAgo from 'react-timeago';

const alertInfo = (type, message) => {
  const notyf = new Notyf({ duration: 2000, position: { x: 'right', y: 'bottom' } });
  switch (type) {
  case 'success':
    return notyf.success(message);
  case 'error':
    return notyf.error(message);
  default:
    return null;
  }
};

const timeAgo = (date) => <TimeAgo date={Date.parse(date)} minPeriod="5" />;

const inputTextArea = ({ field, form, ...props }) => (
  <div>
    <textarea {...field} {...props} />
    <p className="text-right text-muted small m-0">
      {field.value !== undefined ? field.value.length : 0}
      /
      {props.maxLength}
    </p>
  </div>
);

const inputFile = ({ field, form, ...props }) => (
  <div className="input-group">
    <div className="custom-file">
      <input type="file" className="custom-file-input cursor-pointer" id="customFile" onChange={props.handleChange} />
      <label className={`custom-file-label ${props.label.includes('.') ? 'image-label' : ''}`} htmlFor="customFile" data-browse="Browse">{props.label}</label>
    </div>
    <div className="input-group-append">
      <button className="btn btn-secondary" type="button" onClick={props.removeFile} disabled={!field.value} style={{ color: '#495057', backgroundColor: '#e9ecef', borderColor: 'rgb(206, 212, 218)' }}>Reset</button>
    </div>
  </div>
);

const protectEmail = (email) => {
  const splitted_email = email.split('@');
  const beforeAt = splitted_email[0];
  const afterAt = splitted_email[1];
  const avg = beforeAt.length / 2;
  const part1 = beforeAt.substring(0, (beforeAt.length - avg));
  const part2 = beforeAt.substring(avg, beforeAt.length);
  const coded = 'x'.repeat(part2.length);
  return `${part1}${coded}@${afterAt}`;
};

export {
  alertInfo, timeAgo, inputTextArea, inputFile, protectEmail,
};
