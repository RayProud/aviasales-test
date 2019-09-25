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

export const turnAllLayoverFiltersOn = function() {
    return {
        type: 'TURN_ALL_LAYOVER_FILTERS_ON' as const
    };
};

export const turnAllLayoverFiltersOff = function() {
    return {
        type: 'TURN_ALL_LAYOVER_FILTERS_OFF' as const
    };
};
