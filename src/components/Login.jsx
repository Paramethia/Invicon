import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useContext } from 'react';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { toast, ToastContainer } from 'react-toastify';
import'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Stylings/Login.css';

const Header = () => {
    return ( 
        <Helmet>
            <title> Invicon - login </title>
        </Helmet>
    );
};

const Login = () => {
    const {username, setName} = useContext(UserContext);
    const [password, setPassword] = useState('');
    let [passwordVisible, setPasswordVisibility] = useState(false);
    const navigate = useNavigate();
    let storedUsername = localStorage.getItem("username");
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisible)
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('https://invicon-server-x4ff.onrender.com/login', { username, password }, {withCredentials: true,})
            console.log('Server response: ', response);
            if (response.data === "Correct username and password.") {
                if (username !== storedUsername) {
                    localStorage.removeItem("username");
                    localStorage.removeItem("inviteLink");
                }
                localStorage.setItem("username", username);
                navigate('/home');
            } else {
                toast.error('Invalid username or password. Try again.', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    theme: "dark"
                });
            }
        } catch(error) {
            console.error('Error logging in: ', error);
            toast.error('Login failed. Please try again later.', {
                position: "top-center",
                autoClose: 2700,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                theme: "dark",
            });
        } finally { setLoading(false) }
    }

    return (
        <>
        <Header />

        <ToastContainer />

        <div className="flex h-screen">
            <div className="hidden md:block md:w-1/2 bg-auto" style={{ backgroundImage: 'url("https://res.cloudinary.com/dbdh6zbvt/image/upload/v1732908359/Invicon_register_log_in_image_p3tfoh.png")' }}></div>
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-400">
                <h1 className="block md:hidden mb-6 text-4xl font-bold text-dark"> Invicon </h1>
                <div className="bg-gray-300 p-8 rounded shadow-md w-3/4 animate__animated animate__fadeInRight">
                    <h3 className="mb-6 text-2xl font-bold  text-dark"> Log in </h3>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4 text-left">
                            <label htmlFor="exampleInputEmail1" className="block text-sm font-bold mb-2">
                                Username:
                            </label>
                            <input
                                type="text"
                                maxLength="14"
                                placeholder="Enter username"
                                className="form-control block w-full bg-gray-200 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                id="exampleInputEmail1"
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>
                        <div className="relative mb-6 text-left">
                            <label htmlFor="exampleInputPassword1" className="block text-sm font-bold mb-2">
                                Password:
                            </label>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                maxLength="21"
                                placeholder="Enter password"
                                className="form-control block w-full bg-gray-200 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                id="exampleInputPassword1"
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                            <button type="button" className="absolute right-2 bottom-2 p-1" onClick={togglePasswordVisibility}>
                                {passwordVisible ? <FaEye /> : <aEyeSlash />}
                            </button>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-dark text-white py-2 rounded-md hover:bg-dark transition duration-300 ease-in-out transform hover:scale-105"> {loading ? <div className="dots-loader m-auto"></div> : "Log in" } </button>
                    </form>
                    
                    <p className="my-4 flex sm:text-sm"> Don't have an account? <Link to='/register' className='text-dark mx-2'> Register </Link></p>
                    <p><Link to='/request' className='text-dark sm:text-sm'>I forgot the Password</Link></p>
                </div>
            </div>           
        </div>
        </>
    );
}

export default Login;
