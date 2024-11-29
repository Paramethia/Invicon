// ToggleSwitch.js

import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import './Extra stlyles.css';


const ToggleSwitch = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className='bg-dark flex relative px-3 mb-5' style={{ backgroundColor: "#101424",left: 0, padding: "10px", borderRadius: "5px" }}>

      <div className=" absolute top-4 px-3 right-4">
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
          <span className="slider round">
            <span className="icon-container">
              {isDarkMode ? <FaSun color="#fff" /> : <FaMoon color="#333" />}
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
