import React from 'react';
import Image from 'next/image';
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
      <Image
          src="/assets/logo_white.svg"
          alt="Logo"
          width={100}
          height={50}
        /></div>
    </div>
  );
}

export default DashboardNav;
