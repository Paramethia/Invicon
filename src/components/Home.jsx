import { useState, useContext, useEffect, useRef } from 'react';
import { Helmet } from "react-helmet";
import { Link} from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer, Flip, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiHome as HomeIcon, FiGift as GiftIcon, FiUsers as UsersIcon, FiMail as ConIcon, FiLogOut as LoutIcon, FiLogIn as LinIcon, FiCopy as CopyIcon } from 'react-icons/fi';
import { FaMoon, FaSun, FaBars, FaTimes, FaPaypal, FaBitcoin, FaWallet, FaTimesCircle } from 'react-icons/fa';
import './Stylings/Extra styles.css';

const Header = () => {
    return ( 
        <Helmet>
            <title> Invicon - home </title>
            <meta name="description" content="Welcome to Invicon" />
        </Helmet>
    );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const {username} = useContext(UserContext);
    const inviteLink = localStorage.getItem("inviteLink");
    let code = "ABC123";
    
    if (inviteLink) code = inviteLink.slice(-8);

    const logOut = () => { localStorage.removeItem('username') }

    const handleCopyReferralCode = () => {
        navigator.clipboard.writeText(inviteLink);
        toast.success('Copied to clipboard! 🗒️', {
           position: "top-center",
            autoClose: 2800,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
            transition: Slide,
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
                <Link to="/home" className="flex items-center text-white gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'underline' }}>
                    <HomeIcon className="h-4 w-4" /> Home
                </Link>
                <Link to="/dashboard" className="flex text-white items-center gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'none' }}>
                    <UsersIcon className="h-4 w-4" /> Dashboard
                </Link>
                <Link to="/rewards" className="flex items-center text-white  gap-2 rounded-md px-3 py-2 font-helvetica transition-colors H-effect" style={{ textDecoration: 'none' }}>
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
                    <h3 className="text-sm font-bold font-helvetica">Your Referral Code:</h3>
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

const InviteLinkGeneration = () => {
    const [inviteLink, setInviteLink] = useState('');
    const [error, setError] = useState('');
    const {username} = useContext(UserContext);
    const effectRan = useRef(false);
    const navigateTo = useNavigate();

    useEffect(() => {
        if (effectRan.current) return;
        let existingLink = localStorage.getItem('inviteLink');
        if (existingLink && existingLink.includes('invicon.lol')) existingLink = existingLink.replace('invicon.lol', 'invicon.netlify.app') // Because I am no long paying for the domain
        if (existingLink) {
            setInviteLink(existingLink);
        } else {
           const fetchInviteLink = async () => {
            try {
                const response = await axios.post('https://invicon-server-x4ff.onrender.com/generate-invite', {username});
                setInviteLink(response.data.inviteLink);
                localStorage.setItem('inviteLink', response.data.inviteLink);
            } catch (error) {
                setError('Error generating invite link');
                console.error('Error generating invite link:', error);
            }
        };
        if (username) fetchInviteLink()
        effectRan.current = true;
      }
    }, [username]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        toast.success('Copied to clipboard! 🗒️', {
            position: "top-center",
            autoClose: 2800,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "dark",
            transition: Slide,
        });
    };

    return (
        <div className="Link-gen-con bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Your Invite Link</h2>
                <p className="text-gray-500 dark:text-gray-400">Share this link with friends to earn rewards.</p>
            </div>
            <div className="Link-gen flex items-center justify-between">
                {error && <p className="text-base text-red-500">Error generating invite link</p>}
                {username ? (
                    <>
                    { !error && (
                    <>
                    <div onClick={handleCopy} className="Link bg-gray-200 dark:bg-gray-800 rounded-md px-2 md:px-4 py-2 md:text-lg font-medium text-gray-700 dark:text-white">
                        {inviteLink} 
                    </div>
                    <button id="copyB" onClick={handleCopy}>
                        Copy
                    </button>
                    </>
                    )}
                    </>
                ) : (
                    <>
                    <p id="No-login" className="text-sm"> You need to be signed in to generate a link </p>
                    <button id="loginB" onClick={() => navigateTo('/login')}> Log in </button>
                    </>
                )}
            </div>
        </div>
    );
};

let InviteChecker = () => {
    const inviteId = localStorage.getItem("usedInvite");
    const {username} = useContext(UserContext);
    const effectRan = useRef(false);

    if (inviteId === "null") return

    const ping = async () => {
        await fetch('https://invicon-server-x4ff.onrender.com/ping').then(() => console.log("Server awake")).catch(() => console.warn("Could not connect to server"))
    }

    useEffect(() => {
        if (effectRan.current) return;
        ping()

        if (username) {
            const check = async () => {
                try {
                    const response = await axios.post(`https://invicon-server-x4ff.onrender.com/invite-check`, { username, inviteId });
                    if (response.data.message === "Invalid invite code.") {
                        console.error("Error:", response.data.message);
                    } else if (response.data.message === "Code found and updated invites for inviter.") {
                        console.log("Invite code found.");
                        localStorage.removeItem("usedInvite");
                    }
                } catch (err) {
                    console.error(err);
                }
            };

            if (inviteId) check()
            effectRan.current = true;
        }
    }, []);
};

const PaymentOptions = ({ open, username, selectedTier, availableTiers }) => {
    let [loading, setLoading] = useState(false);
    
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

        // Set tier and price dynamically from button click
        const selected = availableTiers.find(t => t.tier === selectedTier);
        if (!selected) return;

        const { tier, price } = selected;

        try {
            setLoading(true)
            // Create Order
            const res = await axios.post("https://invicon-server-x4ff.onrender.com/create-order", { price });
            const orderId = res.data.orderId;

            // Redirect to PayPal
            const approvalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`;
            window.open(approvalUrl, "_blank");

            // Wait for user to finish, then ask for confirmation
            const userConfirmed = window.confirm("After completing the payment, click OK to finalize.");

            if (userConfirmed) {
                // Step 4: Capture Order and Update Tier
                const captureRes = await axios.post("https://invicon-server-x4ff.onrender.com/capture-order", {
                    orderId,
                    username,
                    tier: parseInt(tier.split(' ')[1]) // Tier 1 → 1
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

const Home = () => {
    const inviteLink = useState('');
    const {username, darkMode, setDarkMode} = useContext(UserContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [invites, setInvites] = useState();
    const [tier, setTier] = useState();
    let requiredInvites = 5;
    let nextTier = 1;
    const darkModeStyles = { backgroundColor: '#101424' };
    const lightModeStyles = { backgroundColor: '#dddddd' };
    const [selectedTier, setSelectedTier] = useState('Tier 1');
    const [showAllT, setShowAllT] = useState(false);
    const [isPaymentConOpen, setIsPaymentConOpen] = useState(false);

    if (invites >= 20 || tier === 3) {
        requiredInvites = 35;
        nextTier = 4;
    } else if (invites >= 10 || tier === 2) {
        requiredInvites = 20;
        nextTier = 3;
    } else if (invites >= 5 || tier === 1) {
        requiredInvites = 10;
        nextTier = 2;
    }
        
    requiredInvites -= invites;

    const progressPercentage = (invites / (invites + requiredInvites)) * 100;
    
    const toggleTheme = () => { 
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", !darkMode);
    }

    const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen) }

    const effectRan = useRef(false);
    useEffect(() => {
        if (effectRan.current) return;
        const fetchInviteData = async () => {
            try {
                const response = await axios.post('https://invicon-server-x4ff.onrender.com/invite-data', {username});
                setInvites(response.data.invites);
                setTier(response.data.tier);
            } catch (error) {
                console.error('Error fetching invite data', error);
            } finally {
                setLoading(false)
            }
        };
            
        setTimeout(() => { if (username) fetchInviteData() }, 1428);
        effectRan.current = true;
    }, []);

    const tierSelection = (event) => setSelectedTier(event.target.value);

    const tierShowance = () => {
        var tierSelect = document.getElementById('tiers');
        if (!showAllT) {
            tierSelect.style.display = "none";
            setSelectedTier("none");
            setShowAllT(true);
        } else {
            tierSelect.style.display = "inline-block"
            setSelectedTier("Tier 1");
            setShowAllT(false);
        }
    };

    const availableTiers = [
        { tier: 'Tier 1', invites: 5, price: 4 },
        { tier: 'Tier 2', invites: 10, price: 8 },
        { tier: 'Tier 3', invites: 20, price: 14 },
        { tier: 'Tier 4', invites: 35, price: 20 }
    ];

    // Filter out the tiers that the user has already unlocked
    const filteredTiers = availableTiers.filter((_, index) => index >= tier);

    return (
        <>

        <InviteChecker />

        <div className="flex h-screen">

            { !isPaymentConOpen && (<Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} inviteLink={inviteLink} />)}

            <main className="flex-1 space-y-6 p-8 overflow-auto" style={darkMode ? darkModeStyles : lightModeStyles}>
                <div
                    className="Top-bar flex px-3 mb-5 items-center justify-between"
                    style={{
                        backgroundColor: darkMode ? '#101424' : '#282434',
                        padding: '10px',
                        borderRadius: '5px',
                    }}
                >
                    <ToastContainer />
                    
                    <div className={`ham-menu md:hidden left-12 z-50 ${isSidebarOpen ? 'hidden' : ''}`}>
                        <button onClick={toggleSidebar}>
                            <FaBars className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <Link to="/home" style={{ textDecoration: 'none' }} className="Logo flex-1">
                        <div className="text-white flex items-center gap-2 justify-center md:justify-start">
                            <img src="Invicon top bar logo.png" alt="Invicon Logo" className="w-8 h-8" />
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
                <div className="max-w-3xl mx-auto mt-12">
                    <h1 className="text-3xl font-bold" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}>
                        How it works
                    </h1>
                    <p className="text-gray-500" style={{ color: darkMode ? '#a0aec0' : '#4a5568' }}>
                        You invite people using your own generated invite link. The more invites you get, the more tiers you unlock to earn better and bigger rewards. <br />
                        Alternatively, you can buy tiers to get instant access to the rewards for if you are unable to invite people. Prices will be shown below. <br />
                        <span id="look">You can claim rewards in the <Link id="R-page" to="/rewards"> rewards page </Link>.</span>
                    </p>
                </div> 
                <div className="max-w-3xl mx-auto grid gap-6">
                    <InviteLinkGeneration />
                    <div className="Stats bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        { loading ? (
                           <>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-white"> { username ? "Waiting for server response..." : "Sign in to get your stats."} </h2>
                            <center>
                                <div className="loader"></div>
                            </center>
                            </>
                        ) : (
                         <>
                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Stats</h2>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                  {invites >= 2 || invites === 0 ? (
                                    <>You have invited a total of <strong>{invites}</strong> people.</>
                                  ) : (
                                    <>You have invited <strong>{invites}</strong> person.</>
                                  )}
                                </p>
                                {tier < 4 && (
                                    <>
                                       <p className="text-gray-500 dark:text-gray-400">You need <strong>{requiredInvites}</strong> more {requiredInvites === 1 ? "invite" : "invites"} to get to tier <strong>{nextTier}</strong> </p>
                                        
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between">
                                                <span className="font-helvetica">Tier progress</span>
                                                <span className="font-helvetica">{invites}/{invites + requiredInvites}</span>
                                            </div>
                                            <div className="mt-2 max-w-[500px] h-5 border-black - border-2 bg-gray-300 rounded-lg overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-400"
                                                    style={{ width: `${progressPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-gray-700 dark:text-white">Tier - {tier}</div>
                               
                                <Link to="/dashboard" className="flex text-white items-center gap-2 rounded-md px-3 py-2 text-sm font-medium font-helvetica transition-colors hover:bg-muted" style={{ textDecoration: 'none' }}> 
                                   <button className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 hover:bg-blue-500 rounded-md"> 
                                       View Invites
                                   </button>
                                </Link>
                            </div>
                        </>
                        )}
                    </div>
                    
                    <h1 className="text-center dark:text-gray-300 text-gray-700 text-4xl" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}>
                        Tier rewards
                    </h1>

                    <div className="Tier-info" style={{ backgroundColor: darkMode ? '#1a202c' : '#ffffff' }}>
                         
                        <h4> Download not necessary </h4>

                        <center>
                        <select id ="tiers" value={selectedTier} onChange={tierSelection}>
                            <option value="Tier 1">Tier 1</option>
                            <option value="Tier 2">Tier 2</option>
                            <option value="Tier 3">Tier 3</option>
                            <option value="Tier 4">Tier 4</option>
                        </select>
                        </center>
                        <br />
                        {showAllT === true && ( <h2 className="text-2xl text center text-gray-500" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}> First tier: </h2> )}
                        {(selectedTier === "Tier 1" || showAllT) && (
                        <ul>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> Something small but nice </li>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> 4GB+ folder </li>
                        </ul>
                        )}
                        {showAllT === true && ( <h2 className="text-2xl text center text-gray-500" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}> Second tier: </h2> )}
                        {(selectedTier === "Tier 2" || showAllT) && (
                        <ul>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> Tier 1 reward (4.4GB)</li>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> Something big </li>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> 8GB+ folder </li>
                        </ul>
                        )}
                        {showAllT === true && ( <h2 className="text-2xl text center text-gray-500" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}> Three tier: </h2> )}
                        {(selectedTier === "Tier 3" || showAllT) && (
                        <ul>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> Tier 1 & 2 rewards </li>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> Something bigger </li>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> 14GB+ folder </li>
                        </ul>
                        )}
                        {showAllT === true && ( <h2 className="text-2xl text center text-gray-500" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}> Fourth tier: </h2> )}
                        {(selectedTier === "Tier 4" || showAllT) && (    
                        <ul>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> All above rewards (30.7GB) </li>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> Something much bigger </li>
                            <li className={`${ darkMode ? "text-gray-300" : "text-gray-700"}`}> 17GB+ </li>
                        </ul>
                        )}

                        <span onClick={tierShowance}> {showAllT ? '➖️' : '➕️'} </span>
                    </div>

                    {tier < 4 ? (
                        <h1 className="text-center dark:text-gray-300 text-gray-700 text-4xl" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}>
                            Tier requirements
                        </h1>
                    ) : (
                        <br />
                    )}

                    {tier === 4 && (
                        <h3 className="text-center dark:text-gray-300 text-gray-700 text-xl" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}>
                            You have reached the highest tier. Go claim your rewards in the rewards page.
                        </h3>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 mb-5 md:grid-cols-4 gap-6">
                        
                        {filteredTiers.map(({ tier, invites, price }, index) => (
                            <div key={index} className="Tier text-center bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col">
                                <h2 className="text-lg font-bold text-2xl text-gray-700 dark:text-white"> {tier} </h2>
                                <p className="text-gray-500 font-semibold dark:text-gray-400"> Reach {invites} invites </p>
                                <p className="text-gray-500 dark:text-gray-400"> or pay </p>
                                <h3 className="text-gray-700 font-bold dark:text-gray-300"> ${price} </h3>
                                <button className="mt-auto bg-gray-300 dark:bg-gray-700 text-gray-900 py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors" onClick={() => { setIsPaymentConOpen(true); setSelectedTier(tier) }}>
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
        
        {isPaymentConOpen && (
            <PaymentOptions open={setIsPaymentConOpen} username={username} selectedTier={selectedTier} availableTiers={availableTiers} />
        )}
        </>
    );
};

export default Home;
