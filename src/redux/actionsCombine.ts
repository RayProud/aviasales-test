import * as filters from './filters/actions';
import * as system from './system/actions';
import * as tickets from './tickets/actions';

export default {
    ...filters,
    ...system,
    ...tickets
};
