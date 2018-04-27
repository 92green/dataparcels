// @flow
import React from 'react';
import type {Element} from 'react';
import PureParcel from './PureParcel';
import Parcel from '../parcel/Parcel';

export default (render: Function, extraProps: Object = {}) => (parcel: Parcel, index: string|number, iter: *): Element<*> => {
    return <PureParcel
        parcel={parcel}
        key={parcel.key()}
        render={() => render(parcel, index, iter)}
        {...extraProps}
    />;
};
