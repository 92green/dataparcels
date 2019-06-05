// @flow

import type {ComponentType} from 'react';
import type {Node} from 'react';
import type Parcel from 'dataparcels';

import React from 'react';
import {SortableContainer} from 'react-sortable-hoc';
import {SortableElement} from 'react-sortable-hoc';

type Props = {
    children: (parcel: Parcel) => Node,
    parcel: Parcel,
    onSortEnd?: ({oldIndex: number, newIndex: number}) => void,
    container?: ComponentType<*>
};

export default ({children, parcel, onSortEnd, container, ...sortableElementProps}: Props) => {
    if(!parcel.isIndexed()) {
        throw new Error(`react-dataparcels-drag's parcel prop must be of type indexed`);
    }

    let Container = container || 'div';
    let ConfiguredElement = SortableElement(({parcel}) => children(parcel));
    let ConfiguredContainer = SortableContainer(({parcel}) => <Container>
        {parcel.toArray((elementParcel, index) => <ConfiguredElement
            key={elementParcel.key}
            index={index}
            parcel={elementParcel}
        />)}
    </Container>);

    return <ConfiguredContainer
        parcel={parcel}
        onSortEnd={(param) => {
            let {oldIndex, newIndex} = param;
            parcel.move(oldIndex, newIndex);
            onSortEnd && onSortEnd(param);
        }}
        {...sortableElementProps}
    />;
};
