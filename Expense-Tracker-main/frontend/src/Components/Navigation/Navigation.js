import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import styled from 'styled-components';
import avatar from '../../img/avatar.png';
import { signout, deleteIcon } from '../../utils/Icons'; // Import delete icon if available
import { menuItems } from '../../utils/menuItems';
import { useGlobalContext } from '../../context/globalContext'; // Import the global context

function Navigation({ active, setActive }) {
    const { user, logoutUser, deleteUser, totalBalance } = useGlobalContext(); // Get user, logout and delete functions from context
    const navigate = useNavigate(); // Initialize useNavigate
    const [loading, setLoading] = useState(false); // State to handle loading during delete operation

    const handleSignOut = () => {
        logoutUser(); // Call logout function from context
        navigate('/login'); // Redirect to login page after sign out
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            setLoading(true);
            try {
                await deleteUser(); // Call delete function from context
                navigate('/login'); // Redirect to login page after account deletion
            } catch (err) {
                console.error('Account deletion error:', err);
                alert('Failed to delete account. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleMenuClick = (link) => {
        navigate(link); // Navigate to the corresponding route
    };

    return (
        <NavStyled>
            <div className="user-con">
                <img src={avatar} alt="User Avatar" />
                <div className="text">
                    {user ? (
                        <>
                            <h2>{user.username}</h2>
                            <p><strong>Balance :</strong> {totalBalance() || 0}</p>
                        </>
                    ) : (
                        <p>Login to access your money</p>
                    )}
                </div>
            </div>
            <ul className="menu-items">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        onClick={() => {
                            setActive(item.id);
                            handleMenuClick(item.link); // Navigate to the route
                        }}
                        className={active === item.id ? 'active' : ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                ))}
            </ul>
            <div className="bottom-nav">
                {user && (
                    <>
                        <button onClick={handleSignOut}>
                            {signout} Sign Out
                        </button>
                        <button onClick={handleDeleteAccount} className="delete-btn" disabled={loading}>
                            {deleteIcon} {loading ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </>
                )}
            </div>
        </NavStyled>
    );
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100%;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
    
    .user-con {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;
        
        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #fcf6f9;
            border: 2px solid #FFFFFF;
            padding: .2rem;
            box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
        }
        
        h2 {
            color: rgba(34, 34, 96, 1);
        }
        
        p {
            color: rgba(34, 34, 96, .6);
        }
    }

    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: .6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all .4s ease-in-out;
            color: rgba(34, 34, 96, .6);
            padding-left: 1rem;
            position: relative;
            
            i {
                color: rgba(34, 34, 96, 0.6);
                font-size: 1.4rem;
                transition: all .4s ease-in-out;
            }
        }
    }

    .active {
        color: rgba(34, 34, 96, 1) !important;
        
        i {
            color: rgba(34, 34, 96, 1) !important;
        }
        
        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: #222260;
            border-radius: 0 10px 10px 0;
        }
    }

    .bottom-nav {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        button {
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
                background-color: #0056b3;
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }

        .delete-btn {
            background-color: #e74c3c;

            &:hover {
                background-color: #c0392b;
            }
        }
    }
`;

export default Navigation;
