// @flow
import type Parcel from '../Parcel';

import first from 'unmutable/lib/first';
import last from 'unmutable/lib/last';

export default (_this: Parcel): Object => ({

    isFirst: (): boolean => {
        // $FlowFixMe - flow can't work out that this function will never be available with no _parent
        return first()(_this._parent.data.child).key === _this.key;
    },

    isLast: (): boolean => {
        // $FlowFixMe - flow can't work out that this function will never be available with no _parent
        return last()(_this._parent.data.child).key === _this.key;
    }
});
