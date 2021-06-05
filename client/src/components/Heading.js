// Imports
import React from 'react';
import "../design/TaskBox.css";
import { Avatar } from '@material-ui/core';
import profile from '../meileng.jpeg';

const Heading = ({setAuth}) => {

    const logout = async e => {
        e.preventDefault();
        try {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        setAuth(false);
        //toast.success("Logout successfully");
        } catch (err) {
        console.error(err.message);
        }
    };

    return (
        <div className="header">
            <a href="#"><div className="logo"></div></a>
            <nav className="top_nav">
                <a href="#"><div>Home</div></a>
                <a href="#"><div>Learn</div></a>
                <a href="#"><div>Settings</div></a>
            </nav>
            <button onClick={e => logout(e)} className="btn btn-primary">
                Logout
            </button>
            <Avatar alt="Mei Leng" src={profile} className="profile_pic" />
        </div>
    );
};

export default Heading;