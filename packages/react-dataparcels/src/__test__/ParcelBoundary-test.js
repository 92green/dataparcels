// @flow
import React from 'react';
import ParcelBoundary from '../ParcelBoundary';
import Parcel from 'dataparcels';
import Action from 'dataparcels/Action';

test('ParcelBoundary should not rerender if parcel has not changed value and pure = true', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();

    let wrapper = shallow(<ParcelBoundary parcel={parcel} pure>
        {childRenderer}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel,
        somethingElse: true
    });

    wrapper.update();

    expect(childRenderer).toHaveBeenCalledTimes(1);
});

test('ParcelBoundary should rerender if parcel has not changed value and pure = false', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();

    let wrapper = shallow(<ParcelBoundary parcel={parcel} pure={false}>
        {childRenderer}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel,
        somethingElse: true
    });

    wrapper.update();

    // greater than one because react with hooks can re-render more than just once
    expect(childRenderer.mock.calls.length > 1).toBe(true);
});

test('ParcelBoundary should rerender if parcel has not changed value but forceUpdate has', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();

    let wrapper = shallow(<ParcelBoundary parcel={parcel} forceUpdate={["abc"]}>
        {childRenderer}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel,
        forceUpdate: ["def"]
    });

    wrapper.update();

    expect(childRenderer).toHaveBeenCalledTimes(2);
});

test('ParcelBoundary should pass parcelBufferControl to childRenderer', async () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();

    shallow(<ParcelBoundary parcel={parcel} buffer>
        {childRenderer}
    </ParcelBoundary>);

    let [, control] = childRenderer.mock.calls[0];

    // handleChange shouldn't be called yet because buffer is true
    expect(control.buffered).toBe(false);
    expect(control.actions.length).toBe(0);
});

test('ParcelBoundary should log deprecation message if modifyBeforeUpdate is used', async () => {
    let {warn} = console;
    // $FlowFixMe
    console.warn = jest.fn(); // eslint-disable-line

    let childRenderer = jest.fn();

    let parcel = new Parcel();

    shallow(<ParcelBoundary parcel={parcel} modifyBeforeUpdate={[() => {}]}>
        {childRenderer}
    </ParcelBoundary>);

    expect(console.warn.mock.calls[0][0]).toEqual(`ParcelBoundary.modifyBeforeUpdate is deprecated. Please use ParcelBoundary.beforeChange instead`);

    // $FlowFixMe
    console.warn = warn; // eslint-disable-line
});
