import { changeTheme, changeLocale, endSearch, hasError } from './actions';

export interface State {
    theme: string,
    locale: string,
    endSearch: boolean,
    hasError: boolean,
}

export type ActionsTypes =
    ReturnType<typeof changeTheme>
    | ReturnType<typeof changeLocale>
    | ReturnType<typeof endSearch>
    | ReturnType<typeof hasError>;
