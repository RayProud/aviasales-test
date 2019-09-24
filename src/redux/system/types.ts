import { changeTheme, changeLocale } from './actions';

export interface State {
    theme: string,
    locale: string,
}

export type ActionsTypes =
    ReturnType<typeof changeTheme>
    | ReturnType<typeof changeLocale>;
