import React from 'react';
import './tickets.css';
import { Ticket as ITicket } from '../../redux/types';
import Ticket from '../ticket/ticket';

interface Props {
    tickets: ITicket[]
}

const Tickets: React.FC<Props> = (props: Props) => {
    const { tickets } = props;
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
                {tickets.slice(0, 10).map(ticket => <Ticket ticket={ticket} />)}
            </ul>
        </main>
    );
};

export default Tickets;