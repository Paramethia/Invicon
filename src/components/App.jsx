import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import RequestPasswordReset from './RequestPasswordReset';
import ResetPassword from './ResetPassword';
import Dashboard from './Dashboard';
import Rewards from './Rewards';
import { UserContext } from './UserContext';

function App() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  // Check local storage (cache) on app load

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const savedTheme = localStorage.getItem("darkMode");

    if (storedUsername) setName(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    if (savedTheme === "false") setDarkMode(false);
  }, []);

  return (
      <UserContext.Provider value={{ username, setName, email, setEmail, darkMode, setDarkMode }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/request" element={<RequestPasswordReset />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </Router>
      </UserContext.Provider>
  );
}

export default App;
