import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { loginUser, error, setError } = useGlobalContext();
    const [inputState, setInputState] = useState({ mobileNumber: '', password: '' });
    const [displayError, setDisplayError] = useState('');
    const { mobileNumber, password } = inputState;
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
        e.preventDefault();
        try {
            const success = await loginUser(inputState);
            if (success) {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <LoginStyled onSubmit={handleSubmit}>
            <div className="form-container">
                <h1>Login</h1>
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
                    <button type="submit">Login</button>
                </div>
                <div className="redirect">
                    <p>Not an account? <span onClick={() => navigate('/signup')}>Sign up</span></p>
                </div>
            </div>
        </LoginStyled>
    );
}

const LoginStyled = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f9a8d4, #fbc6b0);
    font-family: 'Roboto', sans-serif;

    .form-container {
        background: #fff;
        padding: 2rem 3rem;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 400px;
        width: 100%;

        h1 {
            color: #333;
            margin-bottom: 1rem;
        }

        .input-control {
            margin-bottom: 1rem;

            input {
                border: 2px solid #ddd;
                padding: 0.75rem;
                border-radius: 8px;
                width: 100%;
                box-sizing: border-box;
                font-size: 1rem;
                transition: border-color 0.3s;

                &:focus {
                    border-color: #007bff;
                    outline: none;
                }
            }
        }

        .submit-btn {
            margin-top: 1rem;

            button {
                background-color: #007bff;
                color: #fff;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.2s;

                &:hover {
                    background-color: #0056b3;
                }

                &:active {
                    transform: scale(0.98);
                }
            }
        }

        .redirect {
            margin-top: 1rem;

            span {
                color: #007bff;
                cursor: pointer;
                text-decoration: underline;
                transition: color 0.3s;

                &:hover {
                    color: #0056b3;
                }
            }
        }

        .error {
            color: #d9534f;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        }
    }
`;

export default Login;
