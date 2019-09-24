import { LayoverFilter } from './types';

export const changeMostFilter = function(cheapest: boolean) {
    return {
        type: 'CHANGE_MOST_FILTER' as const,
        cheapest
    };
};

export const changeLayoverFilter = function(layovers: LayoverFilter) {
    return {
        type: 'CHANGE_LAYOVER_FILTER' as const,
        layovers
    };
};
