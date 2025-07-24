import { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { Helmet } from "react-helmet";
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiHome as HomeIcon, FiGift as GiftIcon, FiUsers as UsersIcon, FiLogOut as LoutIcon, FiLogIn as LinIcon, FiMail as ConIcon, FiCopy as CopyIcon } from 'react-icons/fi';
import { FaMoon, FaSun, FaBars, FaTimes, FaPaypal, FaBitcoin, FaWallet, FaTimesCircle } from 'react-icons/fa';
import './Stylings/Extra styles.css';

const Header = () => {
    return ( 
        <Helmet>
            <title> Invicon - rewards </title>
        </Helmet>
    );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  let {username} = useContext(UserContext);
  let inviteLink = localStorage.getItem('inviteLink');
  let code = "ABC123";
    
  if (inviteLink) code = inviteLink.slice(-8);

  const logOut = () => { localStoarge.removeItem("username") }

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Copied to clipboard! 🗒️', {
        position: "top-center",
        autoClose: 2800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "dark",
        transition: Slide
    });
  };

  return (
    <>

    <Header />

    <ToastContainer />

    <aside
        className={`w-64 bg-[#282434] text-white flex flex-col p-6 transition-transform transform ${
           isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:block z-40`}
        style={{ backgroundColor: "#282434" }}
    >
      <div className="flex static justify-between items-center mb-6">
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <div className="text-white flex items-center gap-2">
            <img src="Invicon navbar logo.png" alt="Invicon Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold mt-2 font-helvetica">{username}</h1>
          </div>
        </Link>
        <button className="md:hidden" onClick={toggleSidebar}>
            <FaTimes className="h-6 w-6 text-white" />
        </button>
      </div>

      <nav className="Navigation flex flex-col gap-2 mb-10">
        <Link to="/home" className="flex items-center text-white gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'none' }}>
            <HomeIcon className="h-4 w-4" /> Home
        </Link>
        <Link to="/dashboard" className="flex text-white items-center gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'none' }}>
            <UsersIcon className="h-4 w-4" /> Dashboard
        </Link>
        <Link to="/rewards" className="flex items-center text-white gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'underline' }}>
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

      <div className="absolute bottom-0 left-0 right-0 grid gap-4 rounded-lg bg-[#282434] p-4">
        <div className="grid gap-1">
          <h3 className="text-sm font-bold font-helvetica">Your Referral Code</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium font-helvetica">{code}</span>
            <button className="bg-transparent p-2 rounded-full" onClick={handleCopyReferralCode}>
              <CopyIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

const PaymentOptions = ({ open, username, currentTier }) => {
    let [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();
    
    const buyTier = async () => {
        if (!username) {
            toast.warn("Log in first before buying", {
                position: "top-center",
                autoClose: 3300,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark",
                transition: Flip
            });
            setTimeout(()=> { navigateTo("/login") }, 3400 );
            return;
        }

        if (currentTier === null) return;

        const menu = [
          { tier: 1, price: 4 },
          { tier: 2, price: 8 },
          { tier: 3, price: 14 },
          { tier: 4, price: 20 }
        ]

        const nextTier = currentTier + 1;
        const chosen = menu.find(t => t.tier === nextTier);
        const { tier, price } = chosen;

        try {
            setLoading(true)
            // Create Order
            const res = await axios.post("http://invicon-server-x4ff.onrender.com/create-order", { price });
            const orderId = res.data.orderId;

            // Redirect to PayPal
            const approvalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`;
            window.open(approvalUrl, "_blank");

            // Wait for user to finish, then ask for confirmation
            const userConfirmed = window.confirm("After completing the payment, click OK to finalize.");

            if (userConfirmed) {
                // Step 4: Capture Order and Update Tier
                const captureRes = await axios.post("http://invicon-server-x4ff.onrender.com/capture-order", {
                    orderId,
                    username,
                    tier
                });

                if (captureRes.data.message) {
                    toast.success("Tier bought!", {
                        position: "top-center",
                        autoClose: 2000,
                        pauseOnHover: false,
                        theme: "dark",
                        transition: Zoom
                    });
                    setTimeout(() => { window.location.reload() }, 2100 )
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong with the payment", {
                position: "top-center",
                autoClose: 3000,
                pauseOnHover: false,
                hideProgressBar: true
            });
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-8 overflow-y-auto">
            <div className="Payment-options bg-gray-300 dark:bg-gray-800 rounded-lg p-6 relative">
                <button onClick={() => open(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white">
                    <FaTimesCircle className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-4 text-center">Select Payment Method</h2>
                <div className="grid gap-4">
                    <button onClick={buyTier} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" disabled={loading}>
                        { loading ? (
                            <center><div className="dotted-loader"></div></center>
                        ) : (
                            <>
                            <FaPaypal className="inline w-6 h-6 mr-2" /> PayPal
                            </>
                        )}
                    </button>
                    <a href="https://www.instagram.com/poison8x/profilecard/?igsh=MWRnejFnNzRwN3U3OA==" target="_blank">
                       <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"> <FaBitcoin className="inline w-6 h-6 mr-2" /> Crypto </button>
                    </a>
                    <a href="https://www.instagram.com/poison8x/profilecard/?igsh=MWRnejFnNzRwN3U3OA==">
                       <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"> <FaWallet className="inline w-6 h-6 mr-2" /> Other </button>
                    </a>
                </div>
            </div>
        </div>
    );
}

const Rewards = () => {
  let { username, darkMode, setDarkMode } = useContext(UserContext);
  const [currentTier, setCurrentTier] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null);
  const videoRefs = useRef([]);
  const darkModeStyles = { backgroundColor: '#101424' };
  const lightModeStyles = { backgroundColor: '#ffffff' };
  const [spoilers, setSpoilers] = useState([]);
  const [isPaymentConOpen, setIsPaymentConOpen] = useState(false);

  useEffect(() => {
    const fetchTier = async () => {
        try {
            const response = await axios.post('https://invicon-server-x4ff.onrender.com/getTier', { username });

            if (response.data.message === "User found.") {
                setCurrentTier(response.data.tier);
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching tier:', error);
        }
    };

    if (username) fetchTier();
    
  }, [username]);

  const toggleTheme = () => { 
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", !darkMode);
    }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return ( 
    <>
      <div className="flex h-screen">
        { !isPaymentConOpen && (<Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />)}
        <main className="flex-1 p-8 space-y-6 overflow-auto" style={darkMode ? darkModeStyles : lightModeStyles}>
          <div className="Top-bar flex px-3 mb-5 items-center justify-between"
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
                  <img src="https://res.cloudinary.com/dw7w2at8k/image/upload/v1721763323/00f6d818-53e4-43fd-819d-1efb5932af3c-removebg-preview_jwgmzt.png" alt="Invicon Logo" className="w-8 h-8" />
                  <h1 className="text-2xl font-bold font-helvetica">Invicon</h1>
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
            Rewards claim
          </h1>

          <div className="w-full pt-4 pb-12 dark:bg-gray-800">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
              <div className="mt-10 space-y-4">
                <br />
                <p className="text-center text-xl text-gray-500" style={{ color: darkMode ? '#ffffff' : '#1a202c'}}> Tier rewards will appear below once you unlock tiers: </p>
                
                <p className="text-center text-xl text-gray-500" style={{ color: darkMode ? '#ffffff' : '#1a202c'}}> Current tier: <span className="text-blue-500">{currentTier}</span> </p>
                <br /> <br />

                <div className="Reward-claim">
                  <center>
                    {[1, 2, 3, 4].map((tier) => (
                      currentTier >= tier && (
                      <div key={tier} className="Tier-reward text-center shadow rounded-lg p-6 flex flex-col">
                        <h2 className="text-lg font-bold text-2xl text-green-600"> Tier {tier} unlocked 🔓 </h2>
                        <p className="text-gray-500 font-semibold dark:text-gray-400"> Download your reward </p>
                        <p className="text-gray-500 dark:text-gray-400"> or watch it online </p>
                        <a className="text-center bg-[#282434] text-white font-bold py-2 px-4 rounded transition-colors hover:bg-[#3c3a4e]">
                          <button id="reward-button" className="bg-gray-500 hover:bg-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-md">
                              Claim reward
                          </button>
                        </a>
                      </div>
                    )))}

                    {currentTier < 8 && (
                      <button id="tier-buy-button" className="bg-gray-500 hover:bg-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-md" onClick={() => {setIsPaymentConOpen(true)}}>
                        Buy next tier 🧧
                      </button>
                    )}
                  </center>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {isPaymentConOpen && (
        <PaymentOptions open={setIsPaymentConOpen} username={username} currentTier={currentTier} />
      )}
    </>
  );
};

export default Rewards;
