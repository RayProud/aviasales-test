import { changeTheme, changeLocale, endSearch } from './actions';

export interface State {
    theme: string,
    locale: string,
    endSearch: boolean,
}

export type ActionsTypes =
    ReturnType<typeof changeTheme>
    | ReturnType<typeof changeLocale>
    | ReturnType<typeof endSearch>;
