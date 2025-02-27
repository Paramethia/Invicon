import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import { useEffect, useState, useContext } from 'react';
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { toast, ToastContainer, Bounce, Flip, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css';

const Header = () => {
    return ( 
        <Helmet>
            <title> Invicon - register </title>
        </Helmet>
    );
};

const Register = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let usedInvite = searchParams.get('inviteId');
    const {username, setName} = useContext(UserContext);
    const {email, setEmail} =  useContext(UserContext);
    const [password, setPassword] = useState('');
    let [passwordVisible, setPasswordVisible] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const navigate = useNavigate();
    let [responded, setResponded] = useState(false);
    const [loading, setLoading] = useState(false);
    let [seconds, setSeconds] =  useState(55)

    useEffect(() => {
        let note = document.getElementById("Email-note");
    
        setTimeout(() => {
            note.style.display = 'none'
        }, 4800 );
    });
    
    // To check if the user already has an account on the device to prevent creating and inviting multiple acccount on the same device.

    let alreadyReg = localStorage.getItem("username") || localStorage.getItem("inviteLink");
    let [warning, setWarning] = useState("");

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleRegister = (event) => {
        event.preventDefault();
        setLoading(true)
        var timer = setInterval(() => {
            if (responded) {
                clearInterval(timer);
                loading(false);
            } else {
                if (seconds > 0) seconds--;
                setSeconds(seconds);
            }
        }, 1000);


        // Regular expression to check for invalid characters in the username
        let usernameVal = /^[a-zA-Z0-9._]+$/;

        // Check for spaces or invalid characters in the username
        if (!usernameVal.test(username)) {
            setUsernameError("Username cannot have empty spaces, emojis, or other invalid characters.");
            return;
        } else {
            setUsernameError(''); // Clear the error if the username is valid
        }

        if (alreadyReg) {
            setWarning("You cannot create another account while already registered on this device. Log in or reset your password if you forgot.");
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        } else if (usedInvite != null && alreadyReg) {
            setWarning("You cannot use invite links if you already registered on this device.");
            setTimeout(() => {
                navigate('/login');
            }, 4850);
        } else {
            // Construct the request body based on whether email is provided
            const requestBody = {
                username,
                password,
                usedInvite
            };
            if (email) {
                requestBody.email = email;
            }
    
            try {
                const response = await axios.post('https://leakon-server.onrender.com/register', requestBody, {withCredential: true})
                if (response.data === "Account already registered.") {
                    toast.warn("Already registered, pal. Go log in", {
                        position: "top-center",
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        transition: Flip,
                    });
                    setTimeout(() => {
                        navigate('/login');
                    }, 4400);
                } else if (response.data === "Username already taken.") {
                    setUsernameError("Username already in use.")
                } else if (response.data === "Registered.") {
                    localStorage.setItem('usedInvite', usedInvite);
                    localStorage.setItem("username", username);
                    if (email) localStorage.setItem("email", email);
                    navigate('/home');
                }
            } catch(error) {
                console.log("Error registering: ", error);
                toast.error("Registration failed. Please try again later.", {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            } finally { setResponded(true) }
        }   
    }
  
    function clearCache() {
        localStorage.clear()
    }
   
    return (
        <>
        
        <Header />

        <ToastContainer />

        <div className="flex h-screen overflow-hidden">
            <div 
                className="hidden md:flex items-center justify-center md:w-1/2 bg-auto bg-black" 
                style={{ backgroundImage: 'url(https://res.cloudinary.com/dbdh6zbvt/image/upload/v1732908359/Invicon_register_log_in_image_p3tfoh.png)' }}>
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-400">
                <h1 className="block md:hidden mb-6 text-4xl font-bold text-dark">Invicon</h1>
                <div className="bg-gray-300 p-8 rounded shadow-md w-3/4 animate__animated animate__fadeInRight">
                    < !loading ? (
                        <>
                        <h3 className="mb-6 text-2xl font-bold text-dark">Register</h3>
                        <form onSubmit={handleRegister}>
                            <div className="mb-4 text-left">
                                <label htmlFor="exampleInputName" className="block text-sm font-bold mb-2">
                                    Username:
                                </label>
                                <input
                                    type="text"
                                    minlength="3"
                                    maxlength="14"
                                    placeholder="Create username"
                                    className="form-control block w-full bg-gray-200 px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    id="exampleInputName"
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />
                                {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                            </div>
                            <div className="mb-4 text-left">
                                <label htmlFor="exampleInputEmai1" className="block text-sm font-bold mb-2">
                                    Email (optional):
                                </label>
                                <input
                                    type="email"
                                    minlengh="12"
                                    maxlength="35"
                                    placeholder="Enter email"
                                    className="form-control block w-full bg-gray-200 px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    id="exampleInputEmail1"
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>
                              <p Id="Email-note"> Ensure you remember your password if you don't put in your email. </p>
                            <div className="relative mb-6 text-left">
                                <label htmlFor="exampleInputPassword1" className="block text-sm font-bold mb-2">
                                    Password:
                                </label>
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    minlength="4"
                                    maxlength="17"
                                    placeholder="Create password"
                                    className="form-control block w-full bg-gray-200 px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    id="exampleInputPassword1"
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                                <button type="button" className="absolute right-3 bottom-2 p-1" onClick={togglePasswordVisibility}>
                                    {passwordVisible ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                </button>
                            </div>
                            {warning && <p className="text-red-500 text-sm mt-1">{warning}</p>}
                            <button type="submit" className="w-full bg-dark text-white py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"> Register </button>
                        </form>
                        <p className="my-4 mx-2">Already have an account? <Link to='/login' className='text-dark'>Log in</Link></p>
                        </>
                    ) : (
                        <>
                            <h4 className="mb-6 text-xl font-bold text-dark">Server is slow right now. Please wait a minute.</h4>
                            <br />
                            <center>
                                <div className="loader"></div>
                                <br />
                                <p>{seconds}</p>
                            </center>
                        </>
                    )}
                </div>
            </div>
        </div>

        </>
    );
}

export default Register;
