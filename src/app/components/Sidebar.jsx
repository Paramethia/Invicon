import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';
import { FiHome as HomeIcon, FiGift as GiftIcon, FiUsers as UsersIcon, FiMail as ConIcon, FiLogOut as LoutIcon, FiLogIn as LinIcon, FiCopy as CopyIcon } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import '../Stylings/Extra styles.css';

export default function Sidebar ({ isOpen, toggleSidebar, toast, slide }) {
    const { username, inviteId } = useContext(UserContext);

    const location = useLocation();
    const currentPage = location.pathname;

    const logOut = () => { localStorage.removeItem(":username") }

    const handleCopyReferralCode = () => {
        navigator.clipboard.writeText(inviteId);
        toast.success('Copied to clipboard! 🗒️', {
            position: "top-center",
            autoClose: 2800,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
            transition: slide,
        });
    };

    return (
        <>
        <aside
          className={`w-64 bg-[#282434] text-white flex flex-col p-6 transition-transform transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:relative md:block z-40`}
          style={{ backgroundColor: "#282434" }}
        >
            <div className="flex justify-between items-center mb-6">
                <div className="text-white flex items-center gap-2">
                    <img src="Invicon navbar logo.png" alt="Invicon Logo" className="w-8 h-8"/>
                    <h1 className="text-xl font-bold mt-2 font-helvetica">{username}</h1>
                </div>
                <button className="md:hidden" onClick={toggleSidebar}>
                    <FaTimes className="h-6 w-6 text-white" />
                </button>
            </div>

            <nav className="Navigation flex flex-col gap-2 mb-10">
                <Link to="/" className="flex items-center text-white gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: currentPage === "/" ? 'underline' : 'none' }}>
                    <HomeIcon className="h-4 w-4" /> Home
                </Link>
                <Link to="/dashboard" className="flex text-white items-center gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: currentPage === "/dashboard" ? 'underline' : 'none' }}>
                    <UsersIcon className="h-4 w-4" /> Dashboard
                </Link>
                <Link to="/rewards" className="flex items-center text-white  gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: currentPage === "/rewards" ? 'underline' : 'none' }}>
                    <GiftIcon className="h-4 w-4" /> Rewards
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
            
            {inviteId && 
                <div className="absolute bottom-0 left-0 right-0 grid gap-4 rounded-lg bg-[#282434] p-4">
                    <div className="grid gap-1">
                        <h3 className="text-sm font-bold font-helvetica">Your Referral Code:</h3>
                        <div className="r-code flex items-center justify-between">
                            <span className="text-sm font-medium font-helvetica">{inviteId}</span>
                            <button className="bg-transparent p-2 rounded-full" onClick={handleCopyReferralCode}>
                                <CopyIcon id="copy-icon" className="h-4 w-4 H-effect" />
                            </button>
                        </div>
                    </div>
                </div>
            }
        </aside>
        </>
    );
};