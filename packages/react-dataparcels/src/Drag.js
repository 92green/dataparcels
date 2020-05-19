// @flow

import type {ComponentType} from 'react';
import type {Node} from 'react';
import type Parcel from 'dataparcels';

import React from 'react';

import {SortableContainer} from 'react-sortable-hoc';
import {SortableElement} from 'react-sortable-hoc';

const DragElement = SortableElement(({parcel, childRenderer}) => childRenderer(parcel));

const DragContainer = SortableContainer(({parcel, container, childRenderer}) => {
    let Container = container || 'div';
    return <Container>
        {parcel.children((elementParcel, index) => <DragElement
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
    return <DragContainer
        parcel={parcel}
        container={container}
        childRenderer={children}
        onSortEnd={(param) => {
            let {oldIndex, newIndex} = param;
            if(oldIndex !== newIndex) {
                parcel.get(oldIndex).moveTo(newIndex);
            }
            onSortEnd && onSortEnd(param);
        }}
        {...sortableElementProps}
    />;
};
