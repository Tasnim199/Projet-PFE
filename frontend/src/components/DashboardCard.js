// src/components/DashboardCard.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ title, value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }

    const duration = 1000; // durée de l'animation en ms
    const stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-content">
        <h3>{title}</h3>
        <p>{count}</p>
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default DashboardCard;

