import React from 'react';
import './ticket.css';

const Ticket: React.FC = () => {
    return (
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
    );
};

export default Ticket;