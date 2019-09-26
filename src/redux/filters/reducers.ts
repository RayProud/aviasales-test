import { State, ActionsTypes, LayoverFilter } from './types';

const initialState: State = {
    layovers: {},
    cheapest: true
};

function changeAllLayovers(prevLayovers: LayoverFilter, state: boolean) {
    return Object.keys(prevLayovers).reduce((prev: LayoverFilter, key) => {
        prev[key] = state;
        return prev;
    }, {})
}

export function filtersReducer(
    state = initialState,
    action: ActionsTypes
): State {
    switch (action.type) {
        case 'CHANGE_LAYOVER_FILTER': {
            return {
                ...state,
                layovers: {
                    ...state.layovers,
                    ...action.layovers
                }
            };
        }
        case 'CHANGE_MOST_FILTER':
            return {
                ...state,
                cheapest: action.cheapest
            }
        case 'TURN_ALL_LAYOVER_FILTERS_ON':
            return {
                ...state,
                layovers: changeAllLayovers(state.layovers, true)
            };
        case 'TURN_ALL_LAYOVER_FILTERS_OFF':
            return {
                ...state,
                layovers: changeAllLayovers(state.layovers, false)
            };
        default:
            return state;
    }
};