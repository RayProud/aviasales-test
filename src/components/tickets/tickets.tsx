import React from 'react';
import './tickets.css';
import Ticket from '../ticket/ticket';

const Tickets: React.FC = () => {
    return (
        <main className="tickets">
            <div className="tickets__filter">
                <input className="tickets__filter-radio" id="most-cheap" type="radio" name="most" value="cheap" defaultChecked />
                <label htmlFor="most-cheap" className="tickets__filter-label">
                    Самый дешёвый
                </label>
                <input className="tickets__filter-radio" id="most-quick" type="radio" name="most" value="quick" />
                <label htmlFor="most-quick" className="tickets__filter-label">
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