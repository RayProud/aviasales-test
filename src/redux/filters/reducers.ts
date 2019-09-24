import { State, ActionsTypes } from './types';

const initialState: State = {
    layovers: {
        'stops-all': true
    },
    cheapest: true
};

export function filtersReducer(
    state = initialState,
    action: ActionsTypes
): State {
    switch (action.type) {
        case 'CHANGE_LAYOVER_FILTER': {
            return {
                ...state,
                layovers: action.layovers
            };
        }
        case 'CHANGE_MOST_FILTER':
            return {
                ...state,
                cheapest: action.cheapest
            }
        default:
            return state;
    }
};