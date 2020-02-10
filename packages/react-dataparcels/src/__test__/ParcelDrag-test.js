// // @flow
import React from 'react';
import Parcel from 'dataparcels';
import ParcelDrag from '../ParcelDrag';

test('ParcelDrag must pass props correctly', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: [1,2,3],
        handleChange
    });

    // $FlowFixMe
    let wrapper = shallow(<ParcelDrag parcel={parcel} children={() => <div />} />, {disableLifecycleMethods: true});

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

test('ParcelDrag should throw if parcel is not indexed', () => {

    let parcel = new Parcel({
        value: {abc: 123}
    });

    expect(() => {
        // $FlowFixMe
        shallow(<ParcelDrag parcel={parcel} children={() => <div />} />, {disableLifecycleMethods: true});
    }).toThrow(`ParcelDrag's parcel prop must be of type indexed`);
});

test('ParcelDrag must accept onSortEnd and still call internal onSortEnd', () => {

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: [1,2,3],
        handleChange
    });

    let onSortEnd = jest.fn();

    // $FlowFixMe
    let wrapper = shallow(<ParcelDrag parcel={parcel} onSortEnd={onSortEnd} children={() => <div />} />, {disableLifecycleMethods: true});

    let props = wrapper.props();
    let sortEndArg = {oldIndex: 0, newIndex: 2};

    expect(props.parcel).toBe(parcel);
    props.onSortEnd(sortEndArg);
    expect(handleChange.mock.calls[0][0].value).toEqual([2,3,1]);
    expect(onSortEnd.mock.calls[0][0]).toEqual(sortEndArg);
});


test('ParcelDrag must accept additional props and pass them to react-sortable-hoc as props', () => {

    let parcel = new Parcel({
        value: [1,2,3]
    });

    // $FlowFixMe
    let wrapper = shallow(<ParcelDrag parcel={parcel} woo={123} children={() => <div />} />, {disableLifecycleMethods: true});

    let props = wrapper.props();
    expect(props.woo).toBe(123);
});

test('ParcelDrag must render elements and pass parcels to them', () => {

    let value = [1,2,3];

    let parcel = new Parcel({
        value
    });

    let children = jest.fn(() => <div />);

    // $FlowFixMe
    let wrapper = mount(<ParcelDrag parcel={parcel} children={children} />);
    expect(children.mock.calls.map(call => call[0].value)).toEqual([1,2,3]);
});
