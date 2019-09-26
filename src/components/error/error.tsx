import React from 'react';
import './error.css';

const Error: React.FC = () => {
    return (
        <div className="error">
            Произошла ошибка
            <p className="error__additional-text">
                Мы уже отправили её на свои сервера. Попробуйте перезагрузить страницу — иногда это помогает ;)
            </p>
        </div>
    );
};

export default Error;
