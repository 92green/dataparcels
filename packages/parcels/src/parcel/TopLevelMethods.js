// @flow
import type {
    ModifierFunction
} from '../types/Types';

import type Parcel from './Parcel';

export default (_this: Parcel): Object => ({

    // change methods
    refresh: () => {
        // todo
    },

    // modify methods
    addPreModifier: (modifier: ModifierFunction): Parcel => {
        _this._treeshare.setPreModifier(modifier);
        return modifier(_this);
    }
});
