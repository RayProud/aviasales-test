import React from 'react';
import './tickets.css';
import Ticket from '../ticket/ticket';

const Tickets: React.FC = () => {
    return (
        <main className="tickets">
            <div className="main-filter">
            <label htmlFor="most-cheap" className="main-filter__label">
                <input id="most-cheap" type="radio" name="most" value="cheap" defaultChecked />
                Самый дешёвый
            </label>
            <label htmlFor="most-quick" className="main-filter__label">
                <input id="most-quick" type="radio" name="most" value="quick" />
                Самый быстрый
            </label>
            </div>
            <ul className="tickets__list">
                <Ticket />
            </ul>
        </main>
    );
};

export default Tickets;