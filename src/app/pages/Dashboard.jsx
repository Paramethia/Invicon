import { useState, useEffect, useContext, useRef } from 'react';
import { Helmet } from "react-helmet";
import axios from 'axios';
import { UserContext } from '../UserContext';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMoon, FaSun, FaBars } from 'react-icons/fa';
import '../Stylings/Extra styles.css';

const Header = () => {
    return ( 
        <Helmet>
            <title> Invicon - dashboard </title>
        </Helmet>
    );
};

const Dashboard = () => {
    const { username, darkMode, setDarkMode } = useContext(UserContext);
    const [invitees, setInvitees] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const darkModeStyles = { backgroundColor: '#101424' };
    const lightModeStyles = { backgroundColor: '#ffffff' };

    const effectRan = useRef(false);
    useEffect(() => {
        if (effectRan.current) return;
        const fetchInvitees = async () => {
            try {
                const response = await axios.post('https://invicon-server-x4ff.onrender.com/invites', { username });
                if (response.data.message === "No invites yet.") {
                    setInvitees([]);
                } else {
                    setInvitees(response.data.invitees || []);
                }
            } catch (error) {
                console.error("Error fetching invitees:", error);
            }
        }
        if (username) fetchInvitees();
        effectRan.current = true;
    }, []);

    const toggleTheme = () => { 
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", !darkMode);
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
        <Header />
        <ToastContainer />

        <div className="flex h-screen">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} toast={toast} slide={Slide} />
            <main className="flex-1 flex flex-col p-8 overflow-auto" style={darkMode ? darkModeStyles : lightModeStyles}>
                <div
                    className="Top-bar w-full flex px-3 mb-5 items-center justify-between"
                    style={{
                        backgroundColor: darkMode ? '#101424' : '#282434',
                        padding: '10px',
                        borderRadius: '5px',
                    }}
                >
                    <div className={`ham-menu md:hidden left-12 z-50 ${isSidebarOpen ? 'hidden' : ''}`}>
                        <button onClick={toggleSidebar}>
                            <FaBars className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <Link to="/home" style={{ textDecoration: 'none' }} className="Logo flex-1">
                        <div className="text-white flex items-center gap-2 justify-center md:justify-start">
                            <img src="Invicon top bar logo.png" alt="Invicon Logo" className="w-8 h-8" />
                            <h1 className="text-2xl font-bold font-helvetica"> Invicon </h1>
                        </div>
                    </Link>
                    <div className="Theme">
                        <label className="switch">
                            <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
                            <span className="slider round">
                                <span className="icon-container">
                                    {darkMode ? <FaSun color="#fff" /> : <FaMoon color="#333" />}
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
                
                <h1 className="text-center dark:text-gray-300 text-gray-700 text-4xl" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}>
                    Dashboard
                </h1>

                <center>
                <div className="Invitees-con flex-1 flex flex-col overflow-y-auto p-6 space-y-4">
                    {invitees.length > 0 ? (
                        invitees.map((invitee, index) => (
                            <div key={index} className="Invitees bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <svg className="w-10 h-10 rounded-full" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    <div>
                                        <span className="font-medium">{invitee.username}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            Your invites will appear here.
                        </div>
                    )}
                </div>
                </center>
            </main>
        </div>
        </>
    );
};

export default Dashboard;
