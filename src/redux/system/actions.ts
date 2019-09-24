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