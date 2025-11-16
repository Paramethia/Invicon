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
	const [username, setName] = useState(localStorage.getItem('username') || '');
	const [email, setEmail] = useState(localStorage.getItem('email') || '');
	const [darkMode, setDarkMode] = useState(true);

	useEffect(() => {
		const dark = localStorage.getItem("darkMode");
		if (dark === "false") setDarkMode(false);
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
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/rewards" element={<Rewards />} />
				</Routes>
			</Router>
		</UserContext.Provider>
	);
}

export default App;
