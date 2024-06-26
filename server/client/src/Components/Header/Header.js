/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import "./Header.scss";
import Modal from "../Modal/Modal";
import SignUp from "../SignUp/SignUp";
import Login from "../Login/Login";
import { useUser } from "../../Contexts/UserContext";
import { useAuth } from "../../Contexts/AuthContext";
import UserMenu from "../UserMenu/UserMenu";

function Header() {
    const { user, loading } = useUser();
    const { authToken, logout } = useAuth();

    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);

    const userMenuRef = useRef(null);
    const userBtnRef = useRef(null);

    const openSignUpModal = () => setIsSignUpModalOpen(true);
    const closeSignUpModal = () => setIsSignUpModalOpen(false);
    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);
    const handleLogout = () => {
        setIsUserMenuVisible(false);
        logout();
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, []);

    const handleOutsideClick = (e) => {
        if (
            userMenuRef.current &&
            !userMenuRef.current.contains(e.target) &&
            userBtnRef.current &&
            !userBtnRef.current.contains(e.target)
        ) {
            setIsUserMenuVisible(false);
        }
    }

    const toggleUserMenu = (e) => {
        e.stopPropagation();
        setIsUserMenuVisible((prev) => !prev);
    }

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <nav className="navbar">
            <a href="/" className="logo">
                wroteitt
            </a>
            {user && authToken ? (
                <div>
                    <ul className="main-nav" id="js-menu">
                        <li>
                            <div className="pill-btn login" onClick={toggleUserMenu} ref={userBtnRef}>{user.username}</div>
                        </li>
                    </ul>
                    {isUserMenuVisible && <UserMenu ref={userMenuRef} onSignOut={handleLogout} username={user.username}/>}
                </div>
            ) : (
            <ul className="main-nav" id="js-menu">
                <li>
                    <div className="pill-btn signup" onClick={openSignUpModal}>
                        Sign Up
                    </div>
                    <Modal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} className="signup-modal">
                        <SignUp />
                    </Modal>
                </li>
                <li>
                    <div className="pill-btn login" onClick={openLoginModal}>
                        Log In
                    </div>
                    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
                        <Login onClose={closeLoginModal} />
                    </Modal>
                </li>
            </ul>
            )}
        </nav>
    );
}

export default Header;
