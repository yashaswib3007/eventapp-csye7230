import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState('');
  const [emailForReset, setEmailForReset] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [resetStatus, setResetStatus] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.accessToken);
        setError('');
        window.location.href = '/';
      } else {
        setError('Login failed. Please check your username and password.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailForReset }),
      });
      if (response.ok) {
        setResetStatus('A reset token has been sent to your email. Please enter it below along with your new password.');
        setShowTokenInput(true); // Show token input after submitting email
      } else {
        setResetStatus('Failed to send reset email. Please try again.');
      }
    } catch (error) {
      setResetStatus('An error occurred. Please try again later.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (response.ok) {
        setResetStatus('Password reset successfully. Please login with your new password.');
        setShowTokenInput(false);
        setShowForgotPassword(false);
        setToken('');
        setNewPassword('');
        setEmailForReset('');
      } else {
        setResetStatus('Failed to reset password. Please check your token and try again.');
      }
    } catch (error) {
      setResetStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLoginSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => setShowForgotPassword(!showForgotPassword)}>Forgot Password?</button>

      {showForgotPassword && (
        <div>
          {!showTokenInput && (
            <form onSubmit={handleForgotPasswordSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={emailForReset}
                onChange={(e) => setEmailForReset(e.target.value)}
                required
              />
              <button type="submit">Send Reset Email</button>
            </form>
          )}
          {showTokenInput && (
            <form onSubmit={handleResetSubmit}>
              <p>{resetStatus}</p>
              <input
                type="text"
                placeholder="Enter token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit">Reset Password</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
