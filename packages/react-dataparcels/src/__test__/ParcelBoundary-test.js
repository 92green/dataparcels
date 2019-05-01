// @flow
import React from 'react';
import ParcelBoundary from '../ParcelBoundary';
import ParcelBufferControl from '../ParcelBufferControl';
import Parcel from 'dataparcels';
import Action from 'dataparcels/Action';

test('ParcelBoundary should not rerender if parcel has not changed value and pure = true', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});

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
    let parcel2 = new Parcel({value: 456});

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
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

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

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRenderer}
    </ParcelBoundary>);

    let [childParcel, control] = childRenderer.mock.calls[0];
    childParcel.onChange(123);
    // handleChange shouldn't be called yet because hold is true
    expect(control instanceof ParcelBufferControl).toBe(true);
    expect(control.buffered).toBe(false);
    expect(control.actions.length).toBe(0);

    let [childParcel2, control2] = childRenderer.mock.calls[1];
    expect(control2.buffered).toBe(true);
    expect(control2.actions.length).toBe(1);
    expect(control2.actions[0] instanceof Action).toBe(true);
});
