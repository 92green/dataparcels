// @flow
import type {ParcelValueUpdater} from 'dataparcels';

import compose from 'unmutable/compose';

export default (modifyBeforeUpdate: Array<ParcelValueUpdater>) => compose(
    ...modifyBeforeUpdate.map((fn) => parcel => parcel.modifyUp(fn))
);
