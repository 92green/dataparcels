// @flow
import type {Key} from '../types/Types';
import type Parcel from './Parcel';

export default (_this: Parcel): Object => ({
    key: (): Key => {
        return _this._id.key();
    },

    id: (): string => {
        return _this._id.id();
    },

    path: (): Array<Key> => {
        return _this._id.path();
    }
});