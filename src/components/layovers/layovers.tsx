import React from 'react';
import { AppState } from '../../redux/store';
import { getPluralForm } from '../../helpers/formatters';
import { LayoverFilter } from '../../redux/filters/types';
import './layovers.css';

interface Props {
    filters: AppState['filters']['layovers'];
    onChange: (filters: LayoverFilter) => void;
    onSwitchOn: () => void;
    onSwitchOff: () => void;
}

class Layovers extends React.PureComponent<Props> {
    onChangeAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { onSwitchOn, onSwitchOff } = this.props;
        const value = event.target.checked;

        return !!value ? onSwitchOn() : onSwitchOff();
    }

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { onChange } = this.props;
        const value = event.target.checked;
        const id = event.target.id;

        onChange({
            [id]: value
        });
    }

    getLayoverTitle = (stopsKeyword: string) => {
        const plural = new Intl.PluralRules('ru-RU');

        switch (stopsKeyword) {
            case 'all':
                return 'Все';
            case '0':
                return 'Без пересадок'
            default:
                return `${stopsKeyword} ${getPluralForm(plural.select(Number(stopsKeyword)), 'пересадка', 'пересадки', 'пересадок', 'пересадки')}`;
        }
    }

    render() {
        const { filters } = this.props;
        const switchOnState = Object.values(filters).every(filter => filter === true);

        return (
            <aside className="layovers">
                <div className="layovers-inner">
                    <h2 className="layovers__heading">
                        Количество пересадок
                    </h2>
                    <ul className="layovers__list">
                        <li className="layovers__item">
                            <input onChange={this.onChangeAll} checked={!!switchOnState} id='stopsall' type="checkbox" className="layovers__item-checkbox"/>
                            <label htmlFor='stopsall' className="layovers__item-label">
                                {this.getLayoverTitle('all')}
                            </label>
                        </li>
                        {
                            Object.keys(filters).map((filter, i) => {
                                // 🤔 как-то неочевидно выходит получение 0/1/2/3 от stopsN
                                const stopsKeyword = filter[filter.length - 1];

                                return (
                                    <li className="layovers__item" key={`${filter}-${i}`}>
                                        <input onChange={this.onChange} checked={!!filters[filter]} id={filter} type="checkbox" className="layovers__item-checkbox"/>
                                        <label htmlFor={filter} className="layovers__item-label">
                                            {this.getLayoverTitle(stopsKeyword)}
                                        </label>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </aside>
        );
    }
};

export default Layovers;