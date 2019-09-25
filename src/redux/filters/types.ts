import {
    changeMostFilter,
    changeLayoverFilter,
    turnAllLayoverFiltersOn,
    turnAllLayoverFiltersOff
} from './actions';

export interface LayoverFilter {
    [key: string]: boolean
}

export interface State {
    layovers: LayoverFilter,
    cheapest: boolean
}

export type ActionsTypes =
    ReturnType<typeof changeMostFilter>
    | ReturnType<typeof changeLayoverFilter>
    | ReturnType<typeof turnAllLayoverFiltersOn>
    | ReturnType<typeof turnAllLayoverFiltersOff>;
