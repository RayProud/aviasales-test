import React from 'react';
import './layovers.css';

const Layovers: React.FC = () => {
    return (
        <aside className="layovers">
            <div className="layovers-inner">
                <h2 className="layovers__heading">
                    Количество пересадок
                </h2>
                <ul className="layovers__list">
                    <li className="layovers__item">
                        <input id="stops-all" type="checkbox" className="layovers__item-checkbox"/>
                        <label htmlFor="stops-all" className="layovers__item-label">
                            Все
                        </label>
                    </li>
                    <li className="layovers__item">
                        <input id="stops-0" type="checkbox" className="layovers__item-checkbox"/>
                        <label htmlFor="stops-0" className="layovers__item-label">
                            Без пересадок
                        </label>
                    </li>
                    <li className="layovers__item">
                        <input id="stops-1" type="checkbox" className="layovers__item-checkbox"/>
                        <label htmlFor="stops-1" className="layovers__item-label">
                            1 пересадка
                        </label>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Layovers;