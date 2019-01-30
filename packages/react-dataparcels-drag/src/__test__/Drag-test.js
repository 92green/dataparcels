// // @flow
import React from 'react';
import Parcel from 'react-dataparcels';
import Drag from '../Drag';

test('Drag must pass props correctly', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: [1,2,3],
        handleChange
    });

    let MyDrag = Drag({
        element: () => <div />
    });

    // $FlowFixMe
    let wrapper = shallow(<MyDrag parcel={parcel} />, {disableLifecycleMethods: true});

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

test('Drag should throw if parcel is not indexed', () => {

    let parcel = new Parcel({
        value: {abc: 123}
    });

    let MyDrag = Drag({
        element: () => <div />
    });

    expect(() => {
        // $FlowFixMe
        shallow(<MyDrag parcel={parcel} />, {disableLifecycleMethods: true});
    }).toThrow(`react-dataparcels-drag's parcel prop must be of type indexed`);
});

test('Drag must accept onSortEnd and still call internal onSortEnd', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: [1,2,3],
        handleChange
    });

    let MyDrag = Drag({
        element: () => <div />
    });

    let onSortEnd = jest.fn();

    // $FlowFixMe
    let wrapper = shallow(<MyDrag parcel={parcel} onSortEnd={onSortEnd} />, {disableLifecycleMethods: true});

    let props = wrapper.props();
    let sortEndArg = {oldIndex: 0, newIndex: 2};

    expect(props.parcel).toBe(parcel);
    props.onSortEnd(sortEndArg);
    expect(handleChange.mock.calls[0][0].value).toEqual([2,3,1]);
    expect(onSortEnd.mock.calls[0][0]).toEqual(sortEndArg);
});


test('Drag must accept additional params and pass them to react-sortable-hoc', () => {

    let parcel = new Parcel({
        value: [1,2,3]
    });

    let MyDrag = Drag({
        element: () => <div />
    });

    // $FlowFixMe
    let wrapper = shallow(<MyDrag parcel={parcel} woo={123} />, {disableLifecycleMethods: true});

    let props = wrapper.props();
    expect(props.woo).toBe(123);
});

test('Drag must render elements and pass parcels to them', () => {

    let value = [1,2,3];

    let parcel = new Parcel({
        value
    });

    let element = jest.fn(() => <div />);

    let MyDrag = Drag({
        element
    });

    // $FlowFixMe
    let wrapper = mount(<MyDrag parcel={parcel} />);
    expect(element.mock.calls.map(call => call[0].value)).toEqual([1,2,3]);
});
