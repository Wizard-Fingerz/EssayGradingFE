import React from 'react';
import styles from './Dashboard.module.css';

function DashboardNav(props) {
  const { name } = props;

  return (
    <div className={styles.container}>
      <div>
        <h1>{name}</h1>
        <p>{name} Overview</p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search"
          className={styles.input}
        />
      </div>
      <div>
        <img src='assets/logo_white.svg' alt="Logo" />
      </div>
    </div>
  );
}

export default DashboardNav;
