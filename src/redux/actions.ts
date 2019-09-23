import { SearchResponse, Ticket, TicketsResponse } from './types';

export const startSearching = function() {
    return {
        type: 'START_SEARCHING' as const
    };
};

export const ticketsResponseSuccess = function(tickets: Ticket[]) {
    console.log('ticketsResponseSuccess');
    return {
        type: 'PUT_TICKETS' as const,
        tickets
    };
}

export type StartSearching = ReturnType<typeof startSearching>;
export type TicketsResponseSuccess = ReturnType<typeof ticketsResponseSuccess>;

// get a key
// get a bunch of tickets
// success fetch
// error fetch
// put tickets into webworker
// search is over
