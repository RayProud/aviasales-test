import React from 'react';
import { DateTime } from 'luxon';
import { Ticket as ITicket } from '../../redux/tickets/types';
import './ticket.css';

interface Props {
    ticket: ITicket;
}

const Ticket: React.FC<Props> = (props: Props) => {
    const { ticket: {price, segments, carrier} } = props;

    const formettedPrice = new Intl.NumberFormat('ru-RU',
        {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    ).format(price);

    const plural = new Intl.PluralRules('ru-RU');
    const getPluralForm = function(form: string, one: string, few: string, many: string, other: string) {
        switch (form) {
            case 'one':
                return one;
            case 'few':
                return few;
            case 'many':
                return many;
            default:
                return other;
        }
    };

    return (
        <li className="ticket">
            <p className="ticket__price">{formettedPrice}</p>
            <img className="ticket__logo" src={`//pics.avs.io/99/36/${carrier}.png`} alt={`${carrier} logo`} srcSet={`//pics.avs.io/99/36/${carrier}@2x.png 2x`} />
            {segments.map(({date, destination, origin, duration, stops}, i) => {
                const start = DateTime.fromISO(date);
                const end = start.plus({minutes: duration});
                const interval = start.until(end);

                const hasStops = stops.length > 0;
                const layoversForm = getPluralForm(plural.select(stops.length), 'пересадка', 'пересадки', 'пересадок', 'пересадки');

                const stopsHeding = hasStops ? `${stops.length} ${layoversForm}` : 'Без пересадок';
                const stopsInfo = hasStops ? (stops.map(stop => stop)).join(', ') : 'Прямой';

                return (
                    <dl key={i} className="ticket__segment">
                        <div className="ticket__way">
                            <dt className="ticket__details-heading">{origin} – {destination}</dt>
                            <dd className="ticket__details-value">{interval.toFormat('hh:mm')}</dd>
                        </div>
                        <div className="ticket__travel">
                            <dt className="ticket__details-heading">В пути</dt>
                            <dd className="ticket__details-value">{interval.toDuration(['hours', 'minutes']).toFormat('hhч mм')}</dd>
                        </div>
                        <div className="ticket__layouts">
                            <dt className="ticket__details-heading">{stopsHeding}</dt>
                            <dd className="ticket__details-value">{stopsInfo}</dd>
                        </div>
                    </dl>
                );
            })}
        </li>
    );
};

export default Ticket;