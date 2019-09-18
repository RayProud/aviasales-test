import React from 'react';
import './layovers.css';

const Layovers: React.FC = () => {
    return (
        <aside className="layovers">
            <h2 className="layovers__heading">
                Количество пересадок
            </h2>
            <ul className="layovers__list">
                <li className="layovers__item">
                <label htmlFor="stops-all" className="layovers__item-label">
                    <input id="stops-all" type="checkbox" className="layovers__item-checkbox"/>
                    Все
                </label>
                </li>
                <li className="layovers__item">
                <label htmlFor="stops-0" className="layovers__item-label">
                    <input id="stops-0" type="checkbox" className="layovers__item-checkbox"/>
                    Без пересадок
                </label>
                </li>
                <li className="layovers__item">
                <label htmlFor="stops-1" className="layovers__item-label">
                    <input id="stops-1" type="checkbox" className="layovers__item-checkbox"/>
                    1 пересадка
                </label>
                </li>
            </ul>
        </aside>
    );
};

export default Layovers;