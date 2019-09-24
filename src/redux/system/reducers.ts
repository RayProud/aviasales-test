import { State, ActionsTypes } from './types';

const initialState: State = {
    theme: 'white',
    locale: 'ru-RU'
};

export function systemReducer(
    state = initialState,
    action: ActionsTypes
): State {
    switch (action.type) {
        case 'CHANGE_LOCALE': {
            return {
                ...state,
                locale: action.locale
            };
        }
        case 'CHANGE_THEME':
            return {
                ...state,
                theme: action.theme
            };
        default:
            return state;
    }
};