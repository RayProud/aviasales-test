import React from 'react';
import './plug.css';


const Plug: React.FC = () => {
    return (
        <div>
            <div className="plug">
                Мы нашли много рейсов, но ни один не соответствует заданным фильтрам
                <p className="plug__additional-text">
                    Измените количество пересадок, чтобы посмотреть другие варианты передётов
                </p>
            </div>
        </div>
    );
};

export default Plug;
