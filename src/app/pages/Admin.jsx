import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import axios from 'axios';
import { UserContext } from '../UserContext';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import { FaMoon, FaSun, FaBars} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
    return ( 
        <Helmet>
            <title> Invicon - admin </title>
        </Helmet>
    );
};

const Admin = () => {
    const { username, admin, darkMode, setDarkMode } = useContext(UserContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const darkModeStyles = { backgroundColor: '#101424' };
    const lightModeStyles = { backgroundColor: '#ffffff' };

    const navigateTo = useNavigate();

    if (username !== admin) navigateTo("/")

    const toggleTheme = () => { 
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", !darkMode);
    }
    
    const toggleSidebar = () => { setIsSidebarOpen(!isSidebarOpen) }

    const [users, setUsers] = useState([]);

    async function collection() {
        setLoading(true);
        try {
            const response = await axios.post('https://invicon-server-x4ff.onrender.com/collection', { username })

            response.data.users.forEach((u, i) => { u.i = i });
            setUsers(response.data.users);
        } catch (err) {
            toast.error('Error collecting users', {
                position: "top-right",
                autoClose: 1000,
                pauseOnHover: false,
                hideProgressBar: true,
                theme: "dark",
            })
            console.error('Error collecting users --', err);
        } finally { setLoading(false) }
        
    }

    useEffect(() => {
        if (username === admin) collection()
    }, [])

    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);

    const [editUser, setEditUser] = useState(null);

    const filteredUsers = users.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

    async function allOfThem() {
        const response = await fetch('https://invicon-server-x4ff.onrender.com/delete-them', { method: 'POST', body: JSON.stringify({username}), headers: { "Content-Type": "application/json" } })

        if (response.status === 200) {
            toast.success("Deleted all the users", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark",
                transition: Slide,
            })
            setTimeout(() => { window.location.reload() }, 3400 ) 
        } else {
            toast.error('Could not delete them', {
                position: "top-right",
                autoClose: 1300,
                pauseOnHover: false,
                hideProgressBar: true,
                theme: "dark",
            })
        }
    }
    
    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }

    async function deleteSelected() {
        const selection = [];

        for (let i = 0; i < selected.length; i++) {
            selection.push(users.find(u => u.i === i))
        }
        
        const response = await fetch("https://invicon-server-x4ff.onrender.com/delete-selection", { method: "POST", body: JSON.stringify({ username, selection }), headers: { "Content-Type": "application/json" }});

        if (response.status === 200) {
            toast.success('Deleted selected users', {
                position: "top-center",
                autoClose: 2100,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark",
                transition: Slide,
            })
            setTimeout(() => { window.location.reload() }, 2300 )
        } else {
            toast.error('Could not delete', {
                position: "top-right",
                autoClose: 1300,
                pauseOnHover: false,
                hideProgressBar: true,
                theme: "dark",
            })
        }
    
        setSelected([]);
    }

    async function updateUser() {
        const noChange = users.find(u => !editUser.email ? 
            u.username === editUser.username && u.tier === editUser.tier : 
            u.username === editUser.username || u.email === editUser.email && u.tier === editUser.tier
        )
        
        if (username !== admin || noChange) return

        try {
            const response = await fetch('https://invicon-server-x4ff.onrender.com/edit-user', { method: 'POST', body: JSON.stringify({editUser}), headers: { "Content-Type": "application/json" } });

            if (response.status === 200) {
                toast.success("Updated user", {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    theme: "dark",
                    transition: Slide,
                })
            } else {
                toast.error('Could not edit user', {
                    position: "top-right",
                    autoClose: 1500,
                    pauseOnHover: false,
                    hideProgressBar: true,
                    theme: "dark",
                })
            }
        } catch (err) {
            toast.error('Error updating user', {
                position: "top-right",
                autoClose: 1000,
                pauseOnHover: false,
                hideProgressBar: true,
                theme: "dark",
            })
            console.error('Error updating user --', err);
        }

        setTimeout(() => { window.location.reload() }, 1250 )
    }

    async function deleteUser(user) {
        const response = await fetch("https://invicon-server-x4ff.onrender.com/delete-user", {
            method: "POST",
            body: JSON.stringify({ username, selection: user }),
            headers: { "Content-Type": "application/json" }
        });

        if (response.status === 200) {
            toast.success('Deleted the user', {
                position: "top-center",
                autoClose: 2100,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "dark",
                transition: Slide,
            })
            setUsers(users.filter(u => u.i !== user.i));
        } else {
            toast.error('Could not delete', {
                position: "top-right",
                autoClose: 1300,
                pauseOnHover: false,
                hideProgressBar: true,
                theme: "dark",
            })
        }
        setSelected([]);
    }

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
                    <Link to="/" style={{ textDecoration: 'none' }} className="Logo flex-1">
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
                
                <h1 className={`text-center ${ darkMode ? 'text-gray-300' : 'text-gray-700'} text-4xl`}>
                    Administration
                </h1>

                <p className="text-gray-400 text-center dark:text-gray-300 mb-6">
                    Manage your users
                </p>

                { loading ? <center><div className="loader mt-5"></div></center> :
                    <>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                        <div className="text-lg font-semibold text-gray-500 dark:text-gray-300">
                            Total Users: <span className="text-blue-500">{users.length}</span>
                        </div>

                        <input
                            type="text"
                            placeholder="Search users"
                            className={`w-80 md:w-72 px-3 py-2 rounded-md ${ darkMode ? 'bg-gray-300 text-gray-900' : 'bg-gray-600 text-white' } shadow focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="px-4 py-2 rounded-lg bg-gray-400 text-gray-900 hover:bg-blue-500" onClick={allOfThem}>
                            Delete all
                        </button>
                    </div>

                    {selected.length > 0 && (
                        <div className="mb-4 bg-gray-300 dark:bg-gray-700 p-3 rounded-lg flex justify-between">
                            <span className="text-gray-800 dark:text-gray-200">
                                {selected.length} selected
                            </span>
                            <button onClick={deleteSelected} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md">
                                Delete selection
                            </button>
                        </div>
                    )}

                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className={`min-w-full ${darkMode ? 'bg-gray-200' : 'bg-gray-300'}`}>
                            <thead className={`${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`}>
                                <tr>
                                    <th className="p-3"></th>
                                    <th className="p-3">Username</th>
                                    <th className="p-3">Created</th>
                                    <th className="p-3">Tier</th>
                                    <th className="p-3">Invites</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="border-b border-gray-600">
                                        <td className="p-3">
                                            <input type="checkbox" checked={selected.includes(u.i)} onChange={() => toggleSelect(u.i)} />
                                        </td>
                                        <td className="p-3 text-gray-800">{u.username}</td>
                                        <td className="p-3 text-gray-600">{new Date(u.createdOn).toDateString()}</td>
                                        <td className="p-3 text-gray-600">{u.tier}</td>
                                        <td className="p-3 text-gray-600">{u.invitees.length}</td>
                                        <td className="p-3 flex gap-2">
                                            <button onClick={() => setEditUser(u)} className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-md">
                                                Edit
                                            </button>
                                            <button onClick={() => deleteUser(u)} className="bg-gray-500 hover:bg-red-500 text-white px-3 py-1 rounded-md">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {editUser && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-60">
                            <div className="bg-gray-300 p-6 rounded-lg w-96">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Edit User
                                </h2>

                                <label className="text-gray-700">Username</label>
                                <input
                                    type="text"
                                    className="w-full mb-3 p-2 rounded bg-gray-400"
                                    value={editUser.username}
                                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                />
                                { editUser.email && <>
                                <label className="text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full mb-3 p-2 rounded bg-gray-400"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                />
                                </>}
                                <label className="text-gray-700">Tier</label>
                                <select
                                    className="w-full p-2 bg-gray-400 rounded mb-4"
                                    value={editUser.tier}
                                    onChange={(e) => setEditUser({ ...editUser, tier: Number(e.target.value) })}
                                >
                                    <option value={0}>Tier 0</option>
                                    <option value={1}>Tier 1</option>
                                    <option value={2}>Tier 2</option>
                                    <option value={3}>Tier 3</option>
                                    <option value={4}>Tier 4</option>
                                </select>

                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setEditUser(null)} className="px-4 py-2 bg-gray-500 hover:bg-blue-400 text-white rounded-lg">
                                        Cancel
                                    </button>
                                    <button onClick={updateUser} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    </>
                }
            </main>
        </div>
        </>
    );
}

export default Admin;