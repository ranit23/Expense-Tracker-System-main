// src/components/Loader.js
import React from 'react';
import styled from 'styled-components';

const Loader = () => {
    return (
        <LoaderStyled>
            <div className="loader"></div>
        </LoaderStyled>
    );
};

const LoaderStyled = styled.div`
    .loader {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #007bff;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

export default Loader;
