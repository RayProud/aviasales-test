import React from 'react';
import './ticket.css';

const Ticket: React.FC = () => {
    return (
        <li className="ticket">
            <div className="ticket__first-row">
                <p className="ticket__price">13 400 Р</p>
                <img className="ticket__logo" src="https://pics.avs.io/99/36/SU.png" alt="TK logo" srcSet="//pics.avs.io/99/36/TK@2x.png 2x" />
            </div>
            <dl className="ticket__segment">
                <div className="ticket__way">
                    <dt className="ticket__details-heading">MOW – HKT</dt>
                    <dd className="ticket__details-value">10:45 - 08:00</dd>
                </div>
                <div className="ticket__travel">
                    <dt className="ticket__details-heading">В пути</dt>
                    <dd className="ticket__details-value">21ч 15м</dd>
                </div>
                <div className="ticket__layouts">
                    <dt className="ticket__details-heading">2 пересадки</dt>
                    <dd className="ticket__details-value">MOW, HKT</dd>
                </div>
            </dl>
            <dl className="ticket__segment">
                <div className="ticket__way">
                    <dt className="ticket__details-heading">MOW – HKT</dt>
                    <dd className="ticket__details-value">10:45 - 08:00</dd>
                </div>
                <div className="ticket__travel">
                    <dt className="ticket__details-heading">В пути</dt>
                    <dd className="ticket__details-value">21ч 15м</dd>
                </div>
                <div className="ticket__layouts">
                    <dt className="ticket__details-heading">1 пересадка</dt>
                    <dd className="ticket__details-value">HKT</dd>
                </div>
            </dl>
        </li>
    );
};

export default Ticket;