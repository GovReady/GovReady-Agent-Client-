import React, { PropTypes as PT } from 'react';

const LogoutLink = ({show = false, logOutClick}) => {
  if(show) {
    return (
      <a className="log-out btn" href="#" onClick={logOutClick}>Log out</a>
    )
  }
  return <span></span>;
}

LogoutLink.propTypes = {
  show: PT.bool,
  logOutClick: PT.func.isRequired
}

export default LogoutLink;
