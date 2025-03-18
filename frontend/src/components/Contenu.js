import React from 'react';
import './Modules.css';
const Content = () => {
    return (
        <div className="main-content">
            <h3>Content to Validate</h3>
            <ul>
                <li>Content 1 - <button>Validate</button> <button>Reject</button></li>
                <li>Content 2 - <button>Validate</button> <button>Reject</button></li>
            </ul>
        </div>
    );
};

export default Content;
