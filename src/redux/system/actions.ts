import { func } from "prop-types";

export const changeTheme = function(theme: string) {
    return {
        type: 'CHANGE_THEME' as const,
        theme
    };
};

export const changeLocale = function(locale: string) {
    return {
        type: 'CHANGE_LOCALE' as const,
        locale
    };
};

export const endSearch = function() {
    return {
        type: 'END_SEARCH' as const
    };
}

export const hasError = function() {
    return {
        type: 'HAS_ERROR' as const
    };
}
