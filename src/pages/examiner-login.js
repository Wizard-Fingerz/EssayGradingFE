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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user_type === 'examiner') {
                  // Display the token in the console
                  console.log('Token:', data.token);
                  // Save the token to the local storage
                  localStorage.setItem('token', data.token);
                  router.push('/examiner');
                }
                else {
                  alert('You don\'t have an examiner account, please contact your admin')
                }
        
              } else {
                // Handle login failure
                console.error('Login failed');
                alert('Incorrect Login details.')
              }
        } catch (error) {
            // Handle network or request error
            alert('Registration Error, please try again')
            console.error('Network error:', error);
        }
    };



    return (
        <div className={styles.body}>
            <div className={styles.container}>

                <div className={styles.form}>
                    <Image
                        src="/assets/logo.svg"
                        alt="My Logo"
                        width={400}  // Set your desired width
                        height={100} // Set your desired height
                    />
                    <div className={styles.inputCont}>
                        <label>Username:</label><br />
                        <input
                            type="text"
                            placeholder="Enter your username"
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
                    </div>
                </div>
            </div>
        </div>

    );
}

export default LoginPage;
