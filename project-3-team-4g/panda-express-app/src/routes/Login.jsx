import React, {useState} from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import "./Login.css";


function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/cashier";

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //When a successful google login, go to inital page click
  const handleSuccess = (credentialResponse) => {
    console.log('Login successful:', credentialResponse);
    navigate(redirectTo);
  };

  //When a unsuccessful google login
  const handleError = () => {
    console.error('Login failed');
  };

  // Handle manual login submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'employee123' && password === 'password123') {
      console.log('Manual login successful');
      navigate(redirectTo);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <div className="login-header">
        <div className="header-content">
          <h1>Panda Express</h1>
          <button className="home-button" onClick={() => navigate("/")}>Home</button>
        </div>
      </div>

      {/* Place holder login boxes to fill page */}
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-heading">Login</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>

          {/* Display error message if login fails */}
          {error && <p className="error-message">{error}</p>}

          {/* google login*/}
          <div className='googleButon'>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </GoogleOAuthProvider>
          </div>
        </div>

      </div>



    </div>
  );
}

export default LoginPage;
