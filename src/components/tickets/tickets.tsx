import React from 'react';
import './tickets.css';
import { Ticket as ITicket } from '../../redux/tickets/types';
import Ticket from '../ticket/ticket';

interface Props {
    tickets: ITicket[]
    cheapest: boolean
    onSelect: (value: boolean) => void;
}

class Tickets extends React.PureComponent<Props> {
    onChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        this.props.onSelect(value === 'cheap');
    }

    render() {
        const { tickets, cheapest } = this.props;

        return (
            <main className="tickets">
                <div className="tickets__filter">
                    <input onChange={this.onChangeRadio} className="tickets__filter-radio" id="most-cheap" type="radio" name="most" value="cheap" checked={!!cheapest} />
                    <label htmlFor="most-cheap" className="tickets__filter-label">
                        Самый дешёвый
                    </label>
                    <input onChange={this.onChangeRadio} className="tickets__filter-radio" id="most-quick" type="radio" name="most" value="quick" checked={!cheapest} />
                    <label htmlFor="most-quick" className="tickets__filter-label">
                        Самый быстрый
                    </label>
                </div>

                <ul className="tickets__list">
                    {tickets.map((ticket, i) => <Ticket key={`${i}-${ticket.carrier}-${ticket.segments[0].destination}-${ticket.segments[0].date}-${ticket.segments[1].destination}-${ticket.segments[1].date}`} ticket={ticket} />)}
                </ul>
            </main>
        );
    }
};

export default Tickets;