import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./page.module.css";
import { API_BASE_URL } from '../constants';

function LoginPage() {
  const router = useRouter();


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Prepare the login data
    const loginData = {
      username: username,
      password: password,
    };

    // Send a POST request to your Django API endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user_type === 'student') {
          // Display the token in the console
          console.log('Token:', data.token);
          console.log(data)
          console.log('Question ID:', data.course_id)
          // Save the token to the local storage
          localStorage.setItem('token', data.token);
          localStorage.setItem('course_id', data.course_id);
          router.push('/student');
        }
        else {
          alert('You don\'t have a student account, please contact your examiner')
        }

      } else {
        // Handle login failure
        console.error('Login failed');
        alert('Incorrect Login details.')
      }
    } catch (error) {
      // Handle network or request error
      alert('Registration Error: Check internet connection')
      console.error('Network error:', error);
    }
  };



  return (
    <div className={styles.body}>
      <div className={styles.container}>

        <div className={styles.form}>
          <div className={styles.imageContainer}>
            <Image
              src="/assets/logo.png"
              alt="My Logo"
              width={400}
              height={100}
            />
          </div>
          <h2>Student Login</h2> <br/>

          <p>Kindly Login with any of<br /> <b className={styles.boldedText}>Registration Number or Candidate number</b></p>
          <div className={styles.inputCont}>
            {/* <label>Username:</label><br /> */}
            <input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            /><br /></div>
          <div className={styles.inputCont}>

            {/* <label>Password:</label><br /> */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
            /><br /></div>

          <div className={styles.inputCont}>

            <button className={styles.button} style={{ backgroundColor: '#FFA500' }} onClick={handleLogin}>LOGIN</button><br />
          </div>
        </div>
      </div>
    </div>

  );
}

export default LoginPage;
