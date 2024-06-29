import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Header = ({ title }) => {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          Stock Dashboard
        </Link>
      </div>
      <div className="flex-none">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

export default Header;