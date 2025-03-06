import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [privateKey, setPrivateKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState('');
  
  // Utiliser l'URL définie dans les variables d'environnement ou une URL par défaut
  const API_URL = process.env.REACT_APP_API_URL || 'https://votre-api.vercel.app';

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/links?key=${privateKey}`);
      setLinks(response.data.links);
      setIsLoggedIn(true);
      setError('');
    } catch (e) {
      console.error("Erreur:", e);
      setError('Clé privée invalide ou erreur de connexion');
    }
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <div className="login">
          <h1>Dashboard de Connexion</h1>
          <input
            type="text"
            placeholder="Entrez votre clé privée"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <button onClick={handleLogin}>Se connecter</button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="dashboard">
          <h1>Liens GoFile pour {privateKey}</h1>
          <ul>
            {links.length > 0 ? (
              links.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                </li>
              ))
            ) : (
              <li>Aucun lien disponible</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;