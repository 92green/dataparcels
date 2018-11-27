// @flow
import type Parcel from '../Parcel';

import first from 'unmutable/lib/first';
import isEmpty from 'unmutable/lib/isEmpty';
import last from 'unmutable/lib/last';

// $FlowFixMe - flow can't work out that this function will never be available with no _parent
let getParentChild = (_this: Parcel) => _this._parent.data.child;

export default (_this: Parcel): Object => ({

    isFirst: (): boolean => {
        let child = getParentChild(_this);
        if(isEmpty()(child)) {
            return false;
        }

        return first()(child).key === _this.key;
    },

    isLast: (): boolean => {
        let child = getParentChild(_this);
        if(isEmpty()(child)) {
            return false;
        }
        return last()(child).key === _this.key;
    }
});
