import React from 'react';
import './header.css';
import logo from './logo.svg';

const Header: React.FC = () => {
    return (
        <header className="header">
            <img src={logo} className="header__logo" alt="Aviasales logo" />
        </header>
    );
};

export default Header;