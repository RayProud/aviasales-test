import { startSearching, ticketsResponseSuccess } from './actions';
import { Ticket } from './types';

export interface globalState {
    tickets?: Ticket[]
}

const initialState: globalState = {};

type action =
    ReturnType<typeof startSearching>
    | ReturnType<typeof ticketsResponseSuccess>;

const defaultReducer = (state = initialState, action: action) => {
    switch (action.type) {
        case 'PUT_TICKETS':
            return {
                ...state,
                tickets: action.tickets
            };
        default: {
            return state;
        }
    }
  };

export default defaultReducer;
