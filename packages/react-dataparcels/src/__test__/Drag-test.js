// // @flow
import React from 'react';
import Parcel from 'dataparcels';
import Drag from '../Drag';

test('Drag must pass props correctly', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: [1,2,3],
        handleChange
    });

    // $FlowFixMe
    let wrapper = shallow(<Drag parcel={parcel} children={() => <div />} />, {disableLifecycleMethods: true});

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

test('Drag must not call change if oldIndex and newIndex are the same', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: [1,2,3],
        handleChange
    });

    // $FlowFixMe
    let wrapper = shallow(<Drag parcel={parcel} children={() => <div />} />, {disableLifecycleMethods: true});

    // first level in
    let props1 = wrapper.props();
    expect(props1.parcel).toBe(parcel);
    props1.onSortEnd({oldIndex: 1, newIndex: 1});
    expect(handleChange).not.toHaveBeenCalled();
});

test('Drag must accept onSortEnd and still call internal onSortEnd', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: [1,2,3],
        handleChange
    });

    let onSortEnd = jest.fn();

    // $FlowFixMe
    let wrapper = shallow(<Drag parcel={parcel} onSortEnd={onSortEnd} children={() => <div />} />, {disableLifecycleMethods: true});

    let props = wrapper.props();
    let sortEndArg = {oldIndex: 0, newIndex: 2};

    expect(props.parcel).toBe(parcel);
    props.onSortEnd(sortEndArg);
    expect(handleChange.mock.calls[0][0].value).toEqual([2,3,1]);
    expect(onSortEnd.mock.calls[0][0]).toEqual(sortEndArg);
});


test('Drag must accept additional props and pass them to react-sortable-hoc as props', () => {

    let parcel = new Parcel({
        value: [1,2,3]
    });

    // $FlowFixMe
    let wrapper = shallow(<Drag parcel={parcel} woo={123} children={() => <div />} />, {disableLifecycleMethods: true});

    let props = wrapper.props();
    expect(props.woo).toBe(123);
});

test('Drag must render elements and pass parcels to them', () => {

    let value = [1,2,3];

    let parcel = new Parcel({
        value
    });

    let children = jest.fn(() => <div />);

    // $FlowFixMe
    let wrapper = mount(<Drag parcel={parcel} children={children} />);
    expect(children.mock.calls.map(call => call[0].value)).toEqual([1,2,3]);
});
