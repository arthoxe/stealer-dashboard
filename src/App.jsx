import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [privateKey, setPrivateKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [links, setLinks] = useState([]);
  const [keyInfo, setKeyInfo] = useState(null);
  const [error, setError] = useState('');
  
  // Admin state
  const [adminPassword, setAdminPassword] = useState('');
  const [newPrivateKey, setNewPrivateKey] = useState('');
  const [keyDescription, setKeyDescription] = useState('');
  const [allKeys, setAllKeys] = useState({});
  const [adminMessage, setAdminMessage] = useState('');
  
  // Use the URL defined in environment variables or a default URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://stealer-api.vercel.app';

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/links?key=${privateKey}`);
      setLinks(response.data.links);
      setKeyInfo(response.data.keyInfo);
      setIsLoggedIn(true);
      setError('');
    } catch (e) {
      console.error("Error:", e);
      setError('Invalid private key or connection error');
    }
  };

  const handleAdminLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/admin`, {
        action: 'list',
        adminPassword
      });
      
      setAllKeys(response.data.keys);
      setIsAdmin(true);
      setAdminMessage('');
    } catch (e) {
      console.error("Admin login error:", e);
      setAdminMessage('Invalid admin password or connection error');
    }
  };

  const handleAddKey = async () => {
    if (!newPrivateKey) {
      setAdminMessage('Please enter a private key');
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/api/admin`, {
        action: 'add',
        adminPassword,
        privateKey: newPrivateKey,
        description: keyDescription
      });
      
      // Refresh the keys list
      const keysResponse = await axios.post(`${API_URL}/api/admin`, {
        action: 'list',
        adminPassword
      });
      
      setAllKeys(keysResponse.data.keys);
      setNewPrivateKey('');
      setKeyDescription('');
      setAdminMessage('Key added successfully');
    } catch (e) {
      console.error("Add key error:", e);
      setAdminMessage('Error adding key');
    }
  };

  const handleDeleteKey = async (keyToDelete) => {
    try {
      const response = await axios.post(`${API_URL}/api/admin`, {
        action: 'delete',
        adminPassword,
        privateKey: keyToDelete
      });
      
      // Refresh the keys list
      const keysResponse = await axios.post(`${API_URL}/api/admin`, {
        action: 'list',
        adminPassword
      });
      
      setAllKeys(keysResponse.data.keys);
      setAdminMessage('Key deleted successfully');
    } catch (e) {
      console.error("Delete key error:", e);
      setAdminMessage('Error deleting key');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setPrivateKey('');
    setLinks([]);
    setKeyInfo(null);
    setError('');
    setAdminPassword('');
    setAllKeys({});
    setAdminMessage('');
  };

  const showAdminPanel = () => {
    return (
      <div className="admin-panel">
        <h1>Admin Dashboard</h1>
        
        <div className="admin-section">
          <h2>Manage Private Keys</h2>
          <div className="add-key-form">
            <input
              type="text"
              placeholder="New Private Key"
              value={newPrivateKey}
              onChange={(e) => setNewPrivateKey(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={keyDescription}
              onChange={(e) => setKeyDescription(e.target.value)}
            />
            <button onClick={handleAddKey}>Add Key</button>
          </div>
          
          {adminMessage && <p className="admin-message">{adminMessage}</p>}
          
          <h3>Existing Keys</h3>
          <ul className="keys-list">
            {Object.keys(allKeys).length > 0 ? (
              Object.entries(allKeys).map(([key, info]) => (
                <li key={key} className="key-item">
                  <div className="key-info">
                    <span className="key-value">{key}</span>
                    <span className="key-desc">{info.description}</span>
                    <span className="key-date">Created: {new Date(info.createdAt).toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteKey(key)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <li>No keys available</li>
            )}
          </ul>
        </div>
        
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    );
  };

  const showLoginScreen = () => {
    return (
      <div className="login">
        <h1>Dashboard Login</h1>
        
        <div className="user-login">
          <h2>User Login</h2>
          <input
            type="text"
            placeholder="Enter your private key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p className="error">{error}</p>}
        </div>
        
        <div className="admin-login">
          <h2>Admin Login</h2>
          <input
            type="password"
            placeholder="Admin Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          <button onClick={handleAdminLogin}>Admin Login</button>
          {adminMessage && <p className="error">{adminMessage}</p>}
        </div>
      </div>
    );
  };

  const showUserDashboard = () => {
    return (
      <div className="dashboard">
        <h1>GoFile Links for {privateKey}</h1>
        {keyInfo && <p className="key-desc">{keyInfo.description}</p>}
        
        <ul className="links-list">
          {links.length > 0 ? (
            links.map((link, index) => (
              <li key={index} className="link-item">
                <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
              </li>
            ))
          ) : (
            <li>No links available</li>
          )}
        </ul>
        
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    );
  };

  return (
    <div className="app">
      {!isLoggedIn && !isAdmin && showLoginScreen()}
      {isLoggedIn && !isAdmin && showUserDashboard()}
      {isAdmin && showAdminPanel()}
    </div>
  );
}

export default App;