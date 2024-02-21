import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./page.module.css";
import { API_BASE_URL } from '../constants';

function HomePage() {
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

          // Save the token to the local storage
          localStorage.setItem('token', data.token);
          router.push('/exam');
        }
        else {
          alert(`You don&apos;t have a student account, please contact your examiner`);
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

  const handleExaminerLogin = () => {
    // Redirect to the Examiner login page
    router.push('/examiner-login'); // Replace '/examiner-login' with the desired examiner login page URL
  };

  const handleStudentLogin = () => {
    // Redirect to the Examiner login page
    router.push('/student-login'); // Replace '/examiner-login' with the desired examiner login page URL
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
          <div className={styles.homeText}>
            <h1>Welcome to Intelligent Grading Pro system</h1>
            <br />
            <p>Intelligent Grading Pro is a cutting-edge web-based examination grading system, utilizing machine learning algorithms to efficiently evaluate theory questions in computer-based exams. Streamlining the grading process, it ensures consistent and objective assessments, providing educators with a user-friendly interface, customizable grading criteria, and valuable performance analytics for enhanced educational outcomes.</p>
            <br />
            <p>Intelligent Grading Pro stands at the forefront of educational technology, offering a seamless experience for grading theory questions in computer-based exams. Its adaptive machine learning models ensure precise evaluations, while the system&apos;s user-friendly interface and customizable features empower educators with efficient tools for maintaining high standards in assessment and enhancing overall educational outcomes.</p>

          </div><br />
          <div className={styles.homeButtons}>

            <button className={styles.button} style={{ backgroundColor: '#FFA500' }} onClick={handleStudentLogin}>Student Login</button><br />
            <button className={styles.button} style={{ backgroundColor: '#000080' }} onClick={handleExaminerLogin}>Examiner Login</button>
          </div>
        </div>
      </div>
    </div>

  );
}

export default HomePage;
