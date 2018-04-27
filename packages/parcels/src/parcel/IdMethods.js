// @flow
import type {Key} from '../types/Types';
import type Parcel from './Parcel';
import idFilterModifiers from '../parcelId/filterModifiers';

export default (_this: Parcel): Object => ({
    key: (): Key => {
        return _this._parcelData.key;
    },

    id: (): string => {
        return _this._id;
    },

    pathId: (): string => {
        return idFilterModifiers()(_this._id);
    }
});