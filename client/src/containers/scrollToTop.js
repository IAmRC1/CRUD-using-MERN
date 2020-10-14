import React from 'react';

export default function ScrollToTop() {
  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <a id="scroll-top" className="position-fixed" href="#!" role="button" onClick={scrollTop}>
      <svg width="3em" height="3em" viewBox="0 0 16 16" className="bi bi-arrow-up-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
      </svg>
    </a>
  );
}
