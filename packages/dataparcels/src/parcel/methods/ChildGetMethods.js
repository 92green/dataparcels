// @flow
import type Parcel from '../Parcel';

export default (_this: Parcel): Object => ({
    isFirst: (): boolean => _this._parent.isChildFirst,
    isLast: (): boolean => _this._parent.isChildLast
});
