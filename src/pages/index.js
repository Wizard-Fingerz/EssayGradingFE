import { useState, useEffect } from 'react';
import styles from "./page.module.css"

function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        
        <div className={styles.form}>
          <h1 className={styles.title} style={{}}>Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          /><br />
          {/* <button className={styles.button} onClick={handleLogin}>Login</button> */}
        </div>
      </div>
    </div>

  );
}

export default LoginPage;
