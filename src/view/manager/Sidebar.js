import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faPaw,
  faCalendarAlt,
  faClipboardList,
  faUserMd
} from '@fortawesome/free-solid-svg-icons';
import '../../../src/index.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Manager</h2>
      </div>
      <div className="sidebar-menu">
        <ul>
          <li>
            <Link to="dashboard">
              <FontAwesomeIcon icon={faHome} className="fa-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="cages">
              <FontAwesomeIcon icon={faPaw} className="fa-icon" /> Kennel Management
            </Link>
          </li>
          <li>
            <Link to="bookings">
              <FontAwesomeIcon icon={faCalendarAlt} className="fa-icon" /> Booking Management
            </Link>
          </li>
          <li>
            <Link to="medical-records">
              <FontAwesomeIcon icon={faClipboardList} className="fa-icon" /> Medical Records
            </Link>
          </li>
          <li>
            <Link to="vet-scheduling">
              <FontAwesomeIcon icon={faUserMd} className="fa-icon" /> Vet Scheduling
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
