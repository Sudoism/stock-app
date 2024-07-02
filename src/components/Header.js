import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Header = ({ title }) => {
  return (
    <div className="navbar bg-base-100 shadow-lg flex items-center">
      <div className="flex-none">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          Stock Dashboard
        </Link>
      </div>
      <div className="ml-8 flex-grow text-center">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="flex-none">
        {/* Optional right-aligned content can go here */}
      </div>
    </div>
  );
};

export default Header;
