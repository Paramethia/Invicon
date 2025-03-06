import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from "react-helmet";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer, Bounce, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiHome as HomeIcon, FiCamera as CameraIcon, FiUsers as UsersIcon, FiMail as ConIcon, FiLogOut as LoutIcon, FiLogIn as LinIcon, FiCopy as CopyIcon } from 'react-icons/fi';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import './Extra styles.css';

const Header = () => {
    return ( 
        <Helmet>
            <title> Invicon - dashboard </title>
        </Helmet>
    );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  let {username} = useContext(UserContext);
  let inviteLink = localStorage.getItem('inviteLink');
  let code = inviteLink.slice(-8);

  const logOut = () => { localStorage.removeItem("username") }

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Code copied to clipboard! 🗒️', {
        position: "top-center",
        autoClose: 2800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
     });
  };

  return (
    <>

    <Header />

    <aside
        className={`w-64 bg-[#282434] text-white flex flex-col p-6 transition-transform transform ${
           isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:block z-40`}
        style={{ backgroundColor: "#282434" }}
    >
      <div className="flex static justify-between items-center mb-6">
        <div className="text-white flex items-center gap-2">
            <img src="Invicon navbar logo.png" alt="Invicon Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold mt-2 font-helvetica">{username}</h1>
        </div>
        <button className="md:hidden" onClick={toggleSidebar}>
          <FaTimes className="h-6 w-6 text-white" />
        </button>
      </div>

      <nav className="Navigation flex flex-col gap-2 mb-10">
        <Link to="/home" className="flex items-center text-white gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'none' }}>
            <HomeIcon className="h-4 w-4" /> Home
        </Link>
        <Link to="/dashboard" className="flex text-white items-center gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'underline' }}>
            <UsersIcon className="h-4 w-4" /> Dashboard
        </Link>
          <Link to="/rewards" className="flex items-center text-white  gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'none' }}>
            <CameraIcon className="h-4 w-4" /> Rewards
        </Link>
        {username ? (
            <Link to="/login" onClick={logOut} className="flex text-white items-center gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'none' }}>
                <LoutIcon className="h-4 w-4" /> Log out
            </Link>
        ) : (
            <Link to="/login" className="flex text-white items-center gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'none' }}>
                <LinIcon className="h-4 w-4" /> Log in
            </Link>
        )}
      </nav>

      <center>
        <div className="Contact">
            <ConIcon className="h-4 w-4 inline" /> <a href="mailto:kevisbuffalo@gmail.com"> Contact </a>
        </div>
      </center>

      <div className="absolute bottom-0 left-0 right-0 grid gap-4 rounded-lg bg-[#282434] p-4">
        <div className="grid gap-1">
          <h3 className="text-sm font-bold font-helvetica">Your Referral Code</h3>
          <div className="r-code flex items-center justify-between">
            <span className="text-sm font-medium font-helvetica">{code}</span>
            <button className="bg-transparent p-2 rounded-full" onClick={handleCopyReferralCode}>
              <CopyIcon id="copy-icon" className="h-4 w-4 H-effect" />
            </button>
          </div>
        </div>
      </div>
    </aside>

    </>
  );
};

const Dashboard = () => {
    let { username } = useContext(UserContext);
    const [invitees, setInvitees] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const darkModeStyles = { backgroundColor: '#101424' };
    const lightModeStyles = { backgroundColor: '#ffffff' }

    useEffect(() => {
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
        if (username) fetchInvitees()
    }, [username]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>

            <ToastContainer />

            <div className="flex h-screen">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <main className="flex-1 flex flex-col p-8 overflow-auto" style={isDarkMode ? darkModeStyles : lightModeStyles}>
                    <div
                        className="Top-bar w-full flex px-3 mb-5 items-center justify-between"
                        style={{
                            backgroundColor: isDarkMode ? '#101424' : '#282434',
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
                                <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                                <span className="slider round">
                                    <span className="icon-container">
                                        {isDarkMode ? <FaSun color="#fff" /> : <FaMoon color="#333" />}
                                    </span>
                                </span>
                            </label>
                        </div>
                    </div>
                    
                    <h1 className="text-center dark:text-gray-300 text-gray-700 text-4xl" style={{ color: isDarkMode ? '#ffffff' : '#1a202c' }}>
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
