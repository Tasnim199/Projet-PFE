import React from 'react';
import './Modules.css'; 
const Modules = () => {
    return (
        <div className="main-content">
            <h3>Manage Modules</h3>
            <button>Add Module</button>
            <ul>
                <li>Module 1 - <button>Delete</button></li>
                <li>Module 2 - <button>Delete</button></li>
            </ul>
        </div>
    );
};

export default Modules;