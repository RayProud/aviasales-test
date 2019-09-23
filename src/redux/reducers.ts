import { startSearching, ticketsResponseSuccess } from './actions';

const initialState = {};
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
