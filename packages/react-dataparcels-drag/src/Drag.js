// @flow

import type {ComponentType} from 'react';
import type {Node} from 'react';
import type Parcel from 'dataparcels';

import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import {SortableElement} from 'react-sortable-hoc';

type Config = {
    element: (parcel: Parcel, rest: *) => Node,
    container?: ComponentType<*>
};

type Props = {
    parcel: Parcel,
    onSortEnd?: ({oldIndex: number, newIndex: number}) => void
};

export default ({element, container, ...configRest}: Config) => {
    let Container = container || 'div';
    let ConfiguredElement = SortableElement(({parcel, ...rest}) => element(parcel, rest));
    let ConfiguredContainer = SortableContainer(({parcel}) => <Container>
        {parcel.toArray((elementParcel, index) => <ConfiguredElement
            key={elementParcel.key}
            index={index}
            parcel={elementParcel}
        />)}
    </Container>);

    return ({parcel, onSortEnd, ...rest}: Props): Node => {
        if(!parcel.isIndexed()) {
            throw new Error(`react-dataparcels-drag's parcel prop must be of type indexed`);
        }
        return <ConfiguredContainer
            parcel={parcel}
            onSortEnd={(param) => {
                let {oldIndex, newIndex} = param;
                parcel.move(oldIndex, newIndex);
                onSortEnd && onSortEnd(param);
            }}
            {...configRest}
            {...rest}
        />;
    };
};
