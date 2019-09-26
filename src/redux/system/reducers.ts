import { State, ActionsTypes } from './types';

const initialState: State = {
    theme: 'white',
    locale: 'ru-RU',
    endSearch: false,
    hasError: false
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
        case 'END_SEARCH':
            return {
                ...state,
                endSearch: true
            }
        case 'HAS_ERROR':
            return {
                ...state,
                hasError: true
            }
        default:
            return state;
    }
};