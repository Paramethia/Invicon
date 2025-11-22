import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Helmet } from "react-helmet";
import { UserContext } from '../UserContext';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMoon, FaSun, FaBars, FaPaypal, FaWallet, FaTimesCircle } from 'react-icons/fa';
import '../Stylings/Extra styles.css';

const stripePromise = loadStripe("pk_test_51SRAnNIQIrM0wFMr2cJAFDUxpdaQI40zqXO91ySG8LSjklu16lbgqAHWLheNbrSBLJfMdosfmpF2IgPQcnoTM0un00SNR0WC07");

const Header = () => {
	return (
		<Helmet>
			<title> Invicon - rewards </title>
		</Helmet>
	);
};

const PaymentOptions = ({ open, username, currentTier }) => {
	const navigateTo = useNavigate();
	const [pLoading, setPloading] = useState(false);
	const [sLoading, setSloading] = useState(false);

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

	const tiers = [
		{ tier: 1, price: 4 },
		{ tier: 2, price: 8 },
		{ tier: 3, price: 14 },
		{ tier: 4, price: 20 }
	]
	const nextTier = currentTier + 1;
	const tier = tiers.find(t => t.tier === nextTier);

	// Paypal

	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [orderId, setOrderId] = useState(null);

	const buyTier = async () => {
		if (!tier) return;

		try {
			setPloading(true);

			// Create Order
			const res = await axios.post("https://invicon-server-x4ff.onrender.com/create-order", { tier });
			setOrderId(res.data.orderId);

			setShowConfirmModal(true);

			// Redirect to PayPal
			const approvalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${res.data.orderId}`;
			window.open(approvalUrl, "_blank");
		} catch (err) {
			console.error(err);
			toast.error("Could not initialize the payment", {
				position: "top-center",
				autoClose: 3000,
				pauseOnHover: false,
				hideProgressBar: true
			});
		} finally { setPloading(false) }
	};

	const finalizePayment = async () => {
		if (!orderId || !tier) return;

		try {
			setPloading(true);
			const captureRes = await axios.post("https://invicon-server-x4ff.onrender.com/capture-order", {
				orderId,
				username,
				tier: nextTier
			});

			if (captureRes.data.message) {
				toast.success("Tier bought!", {
					position: "top-center",
					autoClose: 2700,
					pauseOnHover: false,
					theme: "dark",
					transition: Slide
				});
				setShowConfirmModal(false);
				setTimeout(() => window.location.reload(), 4000);
			}
		} catch (err) {
			console.error(err);
			toast.error("Payment not approved yet", {
				position: "top-center",
				autoClose: 3000,
				pauseOnHover: false,
				hideProgressBar: true
			});
		} finally { setPloading(false) }
	}

	// Stripe

    const [checkingOut, setCheckingOut] = useState(false);

    const Checkout = () => {
        const stripe = useStripe();
        const elements = useElements();
		const [inputValid, setInputValid] = useState(false);
		const [warning, setWarning] = useState('');

        async function pay(e) {
            e.preventDefault();

			if (!inputValid) {
                setWarning("Invalid card details");
                setTimeout(() => { setWarning('') }, 3000 );
                return
            }

            setSloading(true);
            const res = await axios.post("https://invicon-server-x4ff.onrender.com/create-payment-intent", {
                amount: tier.price * 100,
                username,
                tier: nextTier,
            });

            const { clientSecret } = res.data;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: username },
                },
            });
            setSloading(false)

            if (result.error) {
                console.error(result.error.message);
                toast.error("Payment failed", {
                    position: "top-center",
                    autoClose: 2500,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    theme: "dark",
                });
            } else if (result.paymentIntent.status === "succeeded") {
                await fetch("https://invicon-server-x4ff.onrender.com/update-tier", { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, tier: nextTier })
                });

                toast.success("Tier bought!", {
                    position: "top-center",
                    autoClose: 2250,
                    pauseOnHover: false,
                    hideProgressBar: false,
                    theme: "dark",
                });
                setTimeout(() => { window.location.reload() }, 2555 );
            }
        }

        return (
            <form onSubmit={pay} className="p-4 bg-gray-800 rounded-lg">
                <CardElement 
                    className="p-3 bg-gray-600 rounded-md text-gray-200" 
                    options={{
                        style: {
                            base: {
                                color: "#ccc",
                                "::placeholder": { color: "#aaa"}
                            }
                        }
                    }}
					onChange={(event) => setInputValid(event.complete)}
                />
				<p className="text-red-500 text-sm mt-1">{warning}</p>
                <button type="submit" id="pay" className="mt-4 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400">
                    { sLoading ? <center><div className="dotted-loader"></div></center> : `Pay $${tier.price}` }
                </button>
            </form>
        )
    }

	return (
		<>
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-8 overflow-y-auto">
			<div className="Payment-options bg-gray-300 dark:bg-gray-800 rounded-lg p-6 relative">
				<button onClick={() => open(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white">
					<FaTimesCircle className="w-6 h-6" />
				</button>
				<h2 className="text-lg font-bold text-gray-700 dark:text-white mb-4 text-center">Select Payment Method</h2>
				<div className="grid gap-4">
					<button onClick={buyTier} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" disabled={pLoading}>
						{pLoading ? (
							<center><div className="dotted-loader"></div></center>
						) : (
							<> <FaPaypal className="inline w-6 h-6 mr-2" /> PayPal </>
						)}
					</button>
					{!checkingOut ? (
						<button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700" onClick={() => setCheckingOut(true)} disabled={sLoading}>
							<FaWallet className="inline w-6 h-6 mr-2" /> Card
						</button>
					) : (
						<Elements stripe={stripePromise}>
							<Checkout />
						</Elements> 
					)}
				</div>
			</div>
		</div>

		{showConfirmModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
                <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-6 w-[90%] max-w-sm text-center">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4"> Complete your payment </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6"> After completing your PayPal payment, click "Done" below to finalize your purchase. </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                            Cancel
                        </button>
                        <button onClick={finalizePayment} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" disabled={pLoading}>
                            {pLoading ? "Finalizing..." : "Done"}
                        </button>
                    </div>
                </div>
            </div>
        )}
		</>
	);
}

const Rewards = () => {
	const { username, darkMode, setDarkMode } = useContext(UserContext);
	const [currentTier, setCurrentTier] = useState(0);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const darkModeStyles = { backgroundColor: '#101424' };
	const lightModeStyles = { backgroundColor: '#ffffff' };
	const [isPaymentConOpen, setIsPaymentConOpen] = useState(false);

	const effectRan = useRef(false);
	useEffect(() => {
		if (effectRan.current) return;
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
							{!username && !currentTier && <p className="text-center text-xl text-gray-500 mt-3" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}> Tier rewards will appear below once you unlock tiers: </p>}

							<p className="text-center text-xl text-gray-500" style={{ color: darkMode ? '#ffffff' : '#1a202c' }}> Current tier: <span className="text-blue-500">{currentTier}</span> </p>
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

									{currentTier < 4 && (
										<button id="tier-buy-button" className="bg-gray-500 hover:bg-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-md" onClick={() => { setIsPaymentConOpen(true) }}>
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
