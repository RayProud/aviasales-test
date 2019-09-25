export const getPluralForm = function(form: string, one: string, few: string, many: string, other: string) {
    switch (form) {
        case 'one':
            return one;
        case 'few':
            return few;
        case 'many':
            return many;
        default:
            return other;
    }
};
