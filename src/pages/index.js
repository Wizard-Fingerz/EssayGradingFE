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
          router.push('/exam');
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
      console.error('Network error:', error);
    }
  };

  const handleExaminerLogin = () => {
    // Redirect to the Examiner login page
    router.push('/examiner-login'); // Replace '/examiner-login' with the desired examiner login page URL
  };


  return (
    <div className={styles.body}>
      <div className={styles.container}>

        <div className={styles.form}>
          <div className={styles.imageContainer}>
            <Image
              src="/assets/logo.svg"
              alt="My Logo"
              width={400}
              height={100}
            />
          </div>
          <div className={styles.inputCont}>
            <label>Reg No/Username/Matric No:</label><br />
            <input
              type="text"
              placeholder="e.g. 125/19/2/1193"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            /><br /></div>
          <div className={styles.inputCont}>

            <label>Password:</label><br />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
            /><br /></div>

          <div className={styles.inputCont}>

            <button className={styles.button} style={{ backgroundColor: '#FFA500' }} onClick={handleLogin}>LOGIN</button><br />
            <button className={styles.button} style={{ backgroundColor: '#000080' }} onClick={handleExaminerLogin}>LOGIN TO EXAMINER PORTAL</button>
          </div>
        </div>
      </div>
    </div>

  );
}

export default LoginPage;
