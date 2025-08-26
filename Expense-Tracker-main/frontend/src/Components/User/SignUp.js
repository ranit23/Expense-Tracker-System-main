import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const { signupUser, error, setError } = useGlobalContext();
    const [inputState, setInputState] = useState({ username: '', mobileNumber: '', password: '' });
    const [displayError, setDisplayError] = useState('');
    const { username, mobileNumber, password } = inputState;
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            setDisplayError(error);
            const timer = setTimeout(() => {
                setDisplayError('');
                setError(''); 
            }, 3000);
            return () => clearTimeout(timer); 
        }
    }, [error, setError]);

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError('');
    };

    const handleSubmit = async e => {
        await e.preventDefault();
        await signupUser(inputState);
        if (!error) {
            navigate('/login');
        }
    };

    return (
        <SignUpStyled onSubmit={handleSubmit}>
            <div className="form-container">
                <h1>Create an Account</h1>
                <div className="input-control">
                    <input
                        type="text"
                        value={username}
                        name="username"
                        placeholder="Username (e.g : Tanvir)"
                        onChange={handleInput('username')}
                    />
                </div>
                <div className="input-control">
                    <input
                        type="text"
                        value={mobileNumber}
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        onChange={handleInput('mobileNumber')}
                    />
                </div>
                <div className="input-control">
                    <input
                        type="password"
                        value={password}
                        name="password"
                        placeholder="Password"
                        onChange={handleInput('password')}
                    />
                </div>
                {displayError && <p className="error">{displayError}</p>}
                <div className="submit-btn">
                    <button type="submit">Sign Up</button>
                </div>
                <div className="redirect">
                    <p>Have an account? <span onClick={() => navigate('/login')}>Login</span></p>
                </div>
            </div>
        </SignUpStyled>
    );
}

const SignUpStyled = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #ff7f50, #ff6f91);
    font-family: 'Roboto', sans-serif;

    .form-container {
        background: #fff;
        padding: 2rem 3rem;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 400px;
        width: 100%;

        h1 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 2rem;
            font-weight: 700;
        }

        .input-control {
            margin-bottom: 1.5rem;

            input {
                border: 2px solid #ddd;
                padding: 0.75rem;
                border-radius: 10px;
                width: 100%;
                box-sizing: border-box;
                font-size: 1rem;
                transition: border-color 0.3s;

                &:focus {
                    border-color: #ff6f91;
                    outline: none;
                }
            }
        }

        .submit-btn {
            margin-top: 1.5rem;

            button {
                background-color: #ff6f91;
                color: #fff;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 10px;
                font-size: 1.1rem;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.2s;

                &:hover {
                    background-color: #ff4d6b;
                }

                &:active {
                    transform: scale(0.98);
                }
            }
        }

        .redirect {
            margin-top: 1.5rem;

            span {
                color: #ff6f91;
                cursor: pointer;
                text-decoration: underline;
                transition: color 0.3s;

                &:hover {
                    color: #ff4d6b;
                }
            }
        }

        .error {
            color: #e74c3c;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        }
    }
`;

export default SignUp;
