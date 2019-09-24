import React from 'react';
import { Ticket as ITicket } from '../../redux/types';
import './ticket.css';

interface Props {
    ticket: ITicket;
}

const Ticket: React.FC<Props> = (props: Props) => {
    const { ticket: {price, segments, carrier} } = props;
    // грамматическая форма пересадок
    // i18n
    // форматтер времени, чтобы расчитать время в пути и время вылета
    // форматтер денег
    // локаль вынести в общую ветку настроек приложения

    const formettedPrice = new Intl.NumberFormat('ru-RU',
        {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    ).format(price);

    return (
        <li className="ticket">
            <p className="ticket__price">{formettedPrice}</p>
            <img className="ticket__logo" src={`//pics.avs.io/99/36/${carrier}.png`} alt={`${carrier} logo`} srcSet={`//pics.avs.io/99/36/${carrier}@2x.png 2x`} />
            {segments.map(({date, destination, origin, duration, stops}) => (
                <dl className="ticket__segment">
                    <div className="ticket__way">
                        <dt className="ticket__details-heading">{origin} – {destination}</dt>
                        <dd className="ticket__details-value">{date} - 08:00</dd>
                    </div>
                    <div className="ticket__travel">
                        <dt className="ticket__details-heading">В пути</dt>
                        <dd className="ticket__details-value">{duration}</dd>
                    </div>
                    {stops && stops.length > 0 && (
                        <div className="ticket__layouts">
                            <dt className="ticket__details-heading">{stops.length} пересадки</dt>
                            <dd className="ticket__details-value">{(stops.map(stop => stop)).join(', ')}</dd>
                        </div>
                    )}
                </dl>
            ))}
        </li>
    );
};

export default Ticket;