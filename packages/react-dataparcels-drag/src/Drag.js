// @flow

import type {ComponentType} from 'react';
import type {Node} from 'react';
import type Parcel from 'dataparcels';

import React from 'react';
import asChildNodes from 'dataparcels/asChildNodes';
import move from 'unmutable/move';

import {SortableContainer} from 'react-sortable-hoc';
import {SortableElement} from 'react-sortable-hoc';

const DragElement = SortableElement(({parcel, childRenderer}) => childRenderer(parcel));

const DragContainer = SortableContainer(({parcel, container, childRenderer}) => {
    let Container = container || 'div';
    return <Container>
        {parcel.toArray((elementParcel, index) => <DragElement
            key={elementParcel.key}
            index={index}
            parcel={elementParcel}
            childRenderer={childRenderer}
        />)}
    </Container>;
});

type Props = {
    children: (parcel: Parcel) => Node,
    parcel: Parcel,
    onSortEnd?: ({oldIndex: number, newIndex: number}) => void,
    container?: ComponentType<*>
};

export default ({children, parcel, onSortEnd, container, ...sortableElementProps}: Props) => {
    if(!parcel.isIndexed) {
        throw new Error(`react-dataparcels-drag's parcel prop must be of type indexed`);
    }

    return <DragContainer
        parcel={parcel}
        container={container}
        childRenderer={children}
        onSortEnd={(param) => {
            let {oldIndex, newIndex} = param;
            parcel.update(asChildNodes(move(oldIndex, newIndex)));
            onSortEnd && onSortEnd(param);
        }}
        {...sortableElementProps}
    />;
};
