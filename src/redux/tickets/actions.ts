import { Ticket } from './types';

export const startSearching = function() {
    return {
        type: 'START_SEARCHING' as const
    };
};

export const ticketsResponseSuccess = function(tickets: Ticket[]) {
    return {
        type: 'PUT_TICKETS' as const,
        tickets
    };
}

export type StartSearching = ReturnType<typeof startSearching>;
export type TicketsResponseSuccess = ReturnType<typeof ticketsResponseSuccess>;
