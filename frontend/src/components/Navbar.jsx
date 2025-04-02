import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BookOpenIcon, Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from '../common/firebase';
import { Link } from 'react-router-dom';
import { useStore } from '../store/store';
import { logout } from '../store/reducers/userActions';
import useAxios from '../utils/useAxios';

const Navbar = () => {
    const [state, dispatch] = useStore();
    let Links = [
        { name: state.authenticated ? "DASHBOARD" : "LOGIN", link: state.authenticated ? "/dashboard" : "/login" },
        { name: "ABOUT", link: "/about" },
        { name: "CONTACT", link: "/contact" },
    ];
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [signOut] = useSignOut(auth);
    const api = useAxios();
    const firstLetter = user && user.email ? user.email.charAt(0).toUpperCase() : '';

    const handleLogOut = async () => {
        try {
            api.post(process.env.REACT_APP_API_URL + "/auth/logout", {}, { withCredentials: true, })
                .then(response => {
                    dispatch(logout());
                    navigate("/");
                })
                .catch(error => {
                    alert.error(error.response.data.error)
                });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <div className='w-full top-0 left-0 navbar-container'>
            <div className='md:flex items-center justify-between shadow-xl border border-y-gray-300 bg-white py-4 md:px-10 px-7'>
                <div className='flex justify-between'>
                <Link to='/home' className='font-extrabold text-2xl cursor-pointer flex items-center md:gap-1'>
                        <BookOpenIcon className='w-7 h-7 text-green-500' />
                        <span>DocMate</span>
                </Link>
                <div className='md:hidden flex justify-end w-full'>
                    <div onClick={handleToggle} className='block cursor-pointer w-7 h-7'>
                        {open ? <XMarkIcon /> : <Bars3BottomRightIcon />}
                    </div>
                </div>
                </div>
                <ul className={`md:flex md:items-center md:pb-0 pb-12 md:static md:z-auto w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'block' : 'hidden'}`}>
                    {Links.map((link, index) => (
                        <li key={index} className='md:ml-8 md:my-0 my-7 font-semibold'>
                            <Link to={link.link} className='text-gray-800 font-extrabold hover:text-green-400 duration-500'>{link.name}</Link>
                        </li>
                    ))}
                    <li className='block md:hidden md:ml-8 font-semibold'>
                        <button onClick={handleLogOut} className='btn btn-success bg-green-500 text-white px-3 py-1 rounded-xl duration-500'>Log Out</button>
                    </li>
                    <li className="dropdown dropdown-bottom dropdown-end hidden md:block">
                        <div tabIndex={0} role="button">
                            <div className="avatar placeholder ml-4">
                                <div className="rounded-full w-10 bg-green-500 flex justify-center items-center p-4">
                                    <span className="text-2xl font-bold text-white">{firstLetter}</span>
                                </div>
                            </div>
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-4 shadow bg-gray-100 rounded-box w-64 hidden md:block">
                            <li className='flex justify-center items-end mb-4 font-bold text-green-700'>Welcome, {state?.user?.name}!</li>
                            <li className='flex justify-center items-end text-center'>
                                <button onClick={handleLogOut} className='btn btn-sm btn-success'>
                                    <span className='text-white font-bold'>Log Out</span>
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
