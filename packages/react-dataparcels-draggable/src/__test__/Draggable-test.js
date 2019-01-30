// // @flow
import React from 'react';
import Parcel from 'react-dataparcels';
import Draggable from '../Draggable';

test('Draggable must pass props correctly', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: [1,2,3],
        handleChange
    });

    let MyDraggable = Draggable({
        element: () => <div />
    });

    // $FlowFixMe
    let wrapper = shallow(<MyDraggable parcel={parcel} />, {disableLifecycleMethods: true});

    // first level in
    let props1 = wrapper.props();
    expect(props1.parcel).toBe(parcel);
    props1.onSortEnd({oldIndex: 0, newIndex: 2});
    expect(handleChange.mock.calls[0][0].value).toEqual([2,3,1]);

    // second level in
    let props2 = wrapper.dive().props();
    expect(props2.parcel).toBe(parcel);

    // third level in
    let props3 = wrapper.dive().dive().props();
    expect(props3.children.length).toBe(3);
});

test('Draggable must accept onSortEnd and still call internal onSortEnd', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: [1,2,3],
        handleChange
    });

    let MyDraggable = Draggable({
        element: () => <div />
    });

    let onSortEnd = jest.fn();

    // $FlowFixMe
    let wrapper = shallow(<MyDraggable parcel={parcel} onSortEnd={onSortEnd} />, {disableLifecycleMethods: true});

    let props = wrapper.props();
    let sortEndArg = {oldIndex: 0, newIndex: 2};

    expect(props.parcel).toBe(parcel);
    props.onSortEnd(sortEndArg);
    expect(handleChange.mock.calls[0][0].value).toEqual([2,3,1]);
    expect(onSortEnd.mock.calls[0][0]).toEqual(sortEndArg);
});


test('Draggable must accept additional params and pass them to react-sortable-hoc', () => {

    let parcel = new Parcel({
        value: [1,2,3]
    });

    let MyDraggable = Draggable({
        element: () => <div />
    });

    // $FlowFixMe
    let wrapper = shallow(<MyDraggable parcel={parcel} woo={123} />, {disableLifecycleMethods: true});

    let props = wrapper.props();
    expect(props.woo).toBe(123);
});

test('Draggable must render elements and pass parcels to them', () => {

    let value = [1,2,3];

    let parcel = new Parcel({
        value
    });

    let element = jest.fn(() => <div />);

    let MyDraggable = Draggable({
        element
    });

    // $FlowFixMe
    let wrapper = mount(<MyDraggable parcel={parcel} />);
    expect(element.mock.calls.map(call => call[0].value)).toEqual([1,2,3]);
});
