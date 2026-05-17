import React, { useState,useEffect, use } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from './components/Navbar';
import ConfirmationPopup from './components/ConfirmationPopup';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import './global.css';


function Profile() {
    async function handleDeletingAccount() {
        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/delete", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.ok) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
                alert("Account deleted successfully");
            }
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    }
    async function handleLogout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        alert("Logged out successfully");
    }
    async function handlechangeProfilePic(num) {
    try {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/profile-pic", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ profile_pic: num })
        });
        const result = await response.json();
        if (response.ok) {
            const updatedUser = { ...userData, profile_pic: num };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload();
        }
    } catch (error) {
        console.error('Error updating profile picture:', error);
    }
}
    useAuth();
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const firstName = userData?.username?.split(' ')[0];

    const avatars = {
        '1': "https://api.dicebear.com/7.x/adventurer/svg?seed=one",
        '2': "https://api.dicebear.com/7.x/adventurer/svg?seed=two",
        '3': "https://api.dicebear.com/7.x/adventurer/svg?seed=seventeen",
        '4': "https://api.dicebear.com/7.x/adventurer/svg?seed=four",
        '5': "https://api.dicebear.com/7.x/adventurer/svg?seed=five",
        '6': "https://api.dicebear.com/7.x/adventurer/svg?seed=six",
        '7': "https://api.dicebear.com/7.x/adventurer/svg?seed=seven",
        '8': "https://api.dicebear.com/7.x/adventurer/svg?seed=eight",
        '9': "https://api.dicebear.com/7.x/adventurer/svg?seed=sixteen",
        '10': "https://api.dicebear.com/7.x/adventurer/svg?seed=ten",
        '11': "https://api.dicebear.com/7.x/adventurer/svg?seed=fifteen",
        '12': "https://api.dicebear.com/7.x/adventurer/svg?seed=twelve",
        '13': "https://api.dicebear.com/7.x/adventurer/svg?seed=twentythree"
    }

    const [selectedProfilePic, setSelectedProfilePic] = useState(userData?.profile_pic || '1');
    const [boardCount, setBoardCount] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);
    useEffect(() => {
        const fetchBoardCount = async () => {
            try{
                const response = await fetch(import.meta.env.VITE_API_BASE_URL+"/boards/count",{
                    method:"GET",
                    headers:{
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                });
                const result = await response.json();
                setBoardCount(result.count);
            }catch(err){
                console.log(err);
            }
        }
        fetchBoardCount();
    },[]);

    return (
        <div>
            {showConfirmation && (<ConfirmationPopup onClose={() => setShowConfirmation(false)} onConfirm={()=> handleDeletingAccount()} />)}
            <Navbar />
            <div className='profile-page'>
                <Link className='back-link' to="/">← Back to Boards</Link>
                <h1 className='profile-title'>Hello, {firstName}!</h1>
                <p className='profile-subtitle'>Manage your account settings</p>

                <div className='profile-card'>

                    {/* Avatar Section */}
                    <div className='profile-section'>
                        <h3>Profile Picture</h3>
                        <p>Choose an picture to represent you</p>
                        <div className='avatar-grid'>
                            {Object.keys(avatars).map(num => (
                                <div
                                    key={num}
                                    className={`avatar-option ${selectedProfilePic === num ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedProfilePic(num);
                                        handlechangeProfilePic(num);
                                    }}
                                >
                                    {selectedProfilePic === num && <div className='avatar-check'>✓</div>}
                                    <img src={avatars[num]} alt={`avatar ${num}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User Info Section */}
                    <div className='profile-section'>
                        <h3>User Information</h3>
                        <p>View your account details</p>
                        <div className='profile-info-row'>
                            <div className='profile-info'>
                                <label>Name</label>
                                <div className='profile-name-box'>
                                    <span>{userData?.username}</span>
                                </div>
                                <label>Email</label>
                                <div className='profile-name-box'>
                                    <span>{userData?.email}</span>
                                </div>
                            </div>
                            <div className='boards-count-box'>
                                <div className='boards-count-icon'><ContentPasteIcon /></div>
                                <div>
                                    <p className='boards-count-label'>Boards Created</p>
                                    <h2 className='boards-count-number'>{boardCount}</h2>
                                    <p className='boards-count-desc'>Total boards you have created</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className='profile-section danger-zone'>
                        <div className='danger-header'>
                            <div>
                                <h3>Danger Zone</h3>
                                <p>Permanently delete your account and all data</p>
                            </div>
                            <div style={{display:'flex',gap:'1rem'}}>
                                <button className='btn-logout' onClick={handleLogout}>
                                    Logout
                                </button>
                                <button className='delete-account-btn' onClick={() => setShowConfirmation(true)}>
                                    🗑 Delete Account
                                </button>
                            </div>
                        </div>
                        <div className='danger-warning'>
                            ⚠ This action cannot be undone. All your boards, tasks, and data will be permanently deleted.
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Profile;