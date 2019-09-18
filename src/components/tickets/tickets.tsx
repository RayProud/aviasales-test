import React from 'react';
import './tickets.css';

const Tickets: React.FC = () => {
    return (
        <main className="tickets">
            <div className="main-filter">
            <label htmlFor="most-cheap" className="main-filter__label">
                <input id="most-cheap" type="radio" name="most" value="cheap" checked />
                Самый дешёвый
            </label>
            <label htmlFor="most-quick" className="main-filter__label">
                <input id="most-quick" type="radio" name="most" value="quick" checked />
                Самый быстрый
            </label>
            </div>
            <ul className="tickets__list">
            <li className="ticket">
                <p className="ticket__price">13 400 Р</p>
                <img className="ticket__logo" src="https://pics.avs.io/99/36/TK.png" alt="TK logo" srcSet="//pics.avs.io/99/36/TK@2x.png 2x" />
                <dl className="ticket__segment">
                <div className="ticket__way">
                    <dt className="ticket__way-heading">MOW – HKT</dt>
                    <dd className="ticket__way-time">10:45 - 08:00</dd>
                </div>
                <div className="ticket__travel">
                    <dt className="ticket__travel-heading">MOW – HKT</dt>
                    <dd className="ticket__travel-time">21ч 15м</dd>
                </div>
                <div className="ticket__layouts">
                    <dt className="ticket__layouts-heading">2 пересадки</dt>
                    <dd className="ticket__layouts-list">MOW, HKT</dd>
                </div>
                </dl>
            </li>
            </ul>
        </main>
    );
};

export default Tickets;