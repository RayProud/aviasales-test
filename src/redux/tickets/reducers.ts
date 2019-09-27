import { State, ActionsTypes } from './types';

const initialState: State = {};

export function ticketsReducer(
    state = initialState,
    action: ActionsTypes
): State {
    switch (action.type) {
        case 'PUT_TICKETS':
            return {
                ...state,
                topFiveTickets: action.tickets
            };
        default: {
            return state;
        }
    }
  };

export default ticketsReducer;
