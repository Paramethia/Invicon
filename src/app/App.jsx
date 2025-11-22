import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RequestPasswordReset from './pages/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Rewards from './pages/Rewards';
import { UserContext } from './UserContext';

function App() {
	const [username, setName] = useState(localStorage.getItem('username') || '');
	const [email, setEmail] = useState(localStorage.getItem('email') || '');
	const [inviteLink, setInviteLink] = useState(localStorage.getItem("inviteLink"), null)
	const dark = useState(localStorage.getItem("darkMode") || "true");
	const [darkMode, setDarkMode] = useState(dark[0] === "false" ? false : true);

	return (
		<UserContext.Provider value={{ username, setName, email, setEmail, inviteLink, setInviteLink, darkMode, setDarkMode }}>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
					<Route path="/reset" element={<ResetPassword />} />
					<Route path="/request" element={<RequestPasswordReset />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/rewards" element={<Rewards />} />
				</Routes>
			</Router>
		</UserContext.Provider>
	);
}

export default App;
