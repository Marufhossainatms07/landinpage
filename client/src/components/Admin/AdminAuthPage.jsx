// AdminAuthPage.jsx
import { useState } from 'react';
import axios from 'axios';

const AdminAuthPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);

    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regError, setRegError] = useState(null);
    const [regSuccessMessage, setRegSuccessMessage] = useState(null);

    const [showLogin, setShowLogin] = useState(true);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);
        try {
            // Trim username and password before sending
            const trimmedUsername = username.trim();
            const trimmedPassword = password.trim();

            const response = await axios.post('/api/admin/login', { username: trimmedUsername, password: trimmedPassword });
            const token = response.data.token;
            localStorage.setItem('adminToken', token);
            console.log('Admin logged in successfully, token:', token);
            window.location.href = '/admin/dashboard';
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setLoginError(error.response ? error.response.data.message : 'Login failed');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegError(null);
        setRegSuccessMessage(null);
        try {
            // Trim username and password before sending (though less critical for register)
            const trimmedRegUsername = regUsername.trim();
            const trimmedRegPassword = regPassword.trim();

            const response = await axios.post('/api/admin/register', { username: trimmedRegUsername, password: trimmedRegPassword });
            setRegSuccessMessage(response.data.message);
            setRegUsername('');
            setRegPassword('');
            setRegError(null);
            console.log('Admin registered successfully:', response.data.message);
            setShowLogin(true);
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            setRegError(error.response ? error.response.data.message : 'Registration failed');
            setRegSuccessMessage(null);
        }
    };


    return (
        <div>
            <h2>Admin Authentication</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setShowLogin(true)} style={{ fontWeight: showLogin ? 'bold' : 'normal' }}>Login</button>
                <button onClick={() => setShowLogin(false)} style={{ fontWeight: !showLogin ? 'bold' : 'normal', marginLeft: '10px' }}>Register</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {showLogin ? (
                    <div style={{ width: '400px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}>
                        <h3>Admin Login</h3>
                        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                        <form onSubmit={handleLoginSubmit}>
                            <div>
                                <label htmlFor="username">Username:</label>
                                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div>
                                <label htmlFor="password">Password:</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                ) : (
                    <div style={{ width: '400px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginLeft: '10px' }}>
                        <h3>Admin Registration</h3>
                        {regError && <p style={{ color: 'red' }}>{regError}</p>}
                        {regSuccessMessage && <p style={{ color: 'green' }}>{regSuccessMessage}</p>}
                        <form onSubmit={handleRegisterSubmit}>
                            <div>
                                <label htmlFor="regUsername">Username:</label>
                                <input type="text" id="regUsername" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required />
                            </div>
                            <div>
                                <label htmlFor="regPassword">Password:</label>
                                <input type="password" id="regPassword" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                            </div>
                            <button type="submit">Register</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAuthPage;