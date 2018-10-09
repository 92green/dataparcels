// @flow
import React from 'react';

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import {shallow} from 'enzyme';
import ParcelBoundary from '../ParcelBoundary';
import ParcelBoundaryEquals from '../util/ParcelBoundaryEquals';
import Parcel from 'dataparcels';

jest.useFakeTimers();

test('ParcelBoundary should pass a *value equivalent* parcel to children', () => {
    let parcel = new Parcel({
        value: 123
    });
    let childRenderer = jest.fn();

    let wrapper = shallow(<ParcelBoundary parcel={parcel}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];

    expect(ParcelBoundaryEquals(childParcel, parcel)).toBe(true);
});

test('ParcelBoundary should send correct changes back up when debounce = 0', () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 456,
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);
    expect(handleChange).toHaveBeenCalledTimes(1);
    let newParcel = handleChange.mock.calls[0][0];
    expect(newParcel.value).toBe(123);
});

test('ParcelBoundary should pass a NEW *value equivalent* parcel to children when props change', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});

    let wrapper = shallow(<ParcelBoundary parcel={parcel}>
        {childRenderer}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel: parcel2
    });

    wrapper.update();

    let childParcel = childRenderer.mock.calls[0][0];
    let childParcel2 = childRenderer.mock.calls[1][0];

    expect(ParcelBoundaryEquals(childParcel, parcel)).toBe(true);
    expect(ParcelBoundaryEquals(childParcel2, parcel2)).toBe(true);
});

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

    expect(childRenderer).toHaveBeenCalledTimes(2);
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

test('ParcelBoundary should release changes when called', async () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);
    // handleChange shouldn't be called yet because hold is true
    expect(handleChange).toHaveBeenCalledTimes(0);

    wrapper.update();

    let [childParcel2, actions] = childRenderer.mock.calls[1];
    // inside the parcel boundary, the last change should be applied to the parcel
    expect(childParcel2.value).toBe(123);

    actions.release();

    // handleChange should be called now because release() was called
    expect(handleChange).toHaveBeenCalledTimes(1);
    let newParcel = handleChange.mock.calls[0][0];

    // handleChange should have been called with the correct value
    expect(newParcel.value).toBe(123);
});

test('ParcelBoundary should debounce', async () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: {a:1, b:2},
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debounce={30}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];

    // make a change with a value
    childParcel.get('a').onChange(123);

    // handleChange shouldn't be called yet
    expect(handleChange).toHaveBeenCalledTimes(0);

    // wait 20ms
    jest.advanceTimersByTime(20);

    // handleChange shouldn't be called yet
    expect(handleChange).toHaveBeenCalledTimes(0);

    wrapper.update();
    let childParcel2 = childRenderer.mock.calls[1][0];

    // parcel inside parcel boundary should have updated
    expect(childParcel2.value).toEqual({a:123, b:2});

    // make another change with a value
    childParcel2.get('a').onChange(456);

    // wait another 20ms
    jest.advanceTimersByTime(20);

    // handleChange still shouldn't be called yet
    expect(handleChange).toHaveBeenCalledTimes(0);

    wrapper.update();
    let childParcel3 = childRenderer.mock.calls[2][0];

    // parcel inside parcel boundary should have updated
    expect(childParcel3.value).toEqual({a:456, b:2});

    // make another 2 changes with a value
    childParcel3.get('a').onChange(789);
    childParcel3.get('b').onChange(789);

    // wait another 40ms - with an interval this big, debounce should have finally had time to kick in
    jest.advanceTimersByTime(40);

    // handleChange should have been called
    expect(handleChange).toHaveBeenCalledTimes(1);
    // handleChange should have been called with the most recent set of changes
    expect(handleChange.mock.calls[0][0].value).toEqual({a:789, b:789});
});

test('ParcelBoundary should cancel unreleased changes when receiving a new parcel prop', () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });
    let parcel2 = new Parcel({
        value: 456,
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(789);

    let childParcel2 = childRenderer.mock.calls[1][0];

    // verify that the current value of the parcel has been updated
    expect(childParcel2.value).toBe(789);

    wrapper.setProps({
        parcel: parcel2
    });

    let childParcel3 = childRenderer.mock.calls[2][0];
    // the new value received via props should be passed down WITHOUT the previous 789 change applied
    expect(childParcel3.value).toBe(456);

    let actions = childRenderer.mock.calls[2][1];
    actions.release();

    // after release()ing the buffer, handleChange should not be called, because there should not be anything in the buffer
    expect(handleChange).toHaveBeenCalledTimes(0);
});

test('ParcelBoundary should ignore debounce when sending a ping', () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debounce={100}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.ping();

    // even with debounce applied, handleChange should have been called immediately
    expect(handleChange).toHaveBeenCalledTimes(1);

    // handleChange should have the same value as before
    expect(handleChange.mock.calls[0][0].value).toBe(123);
});

test('ParcelBoundary should use an internal boundary split to stop parcel boundaries using the same parcel from sharing their parcel registries', () => {
    let parcel = new Parcel({
        value: {
            abc: 123,
            def: 123
        }
    });
    let childRendererA = jest.fn();
    let childRendererB = jest.fn();

    let wrapper1 = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRendererA}
    </ParcelBoundary>);

    let wrapper2 = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRendererB}
    </ParcelBoundary>);

    let childParcelA = childRendererA.mock.calls[0][0];
    childParcelA.get('abc').onChange(456);

    let childParcelB = childRendererB.mock.calls[0][0];
    childParcelB.get('def').onChange(456);

    wrapper1.update();
    wrapper2.update();

    let childParcelA2 = childRendererA.mock.calls[1][0];
    let childParcelB2 = childRendererB.mock.calls[1][0];

    expect(childParcelA2.value).toEqual({abc: 456, def: 123});
    expect(childParcelB2.value).toEqual({abc: 123, def: 456});
});

test('ParcelBoundary should render colours when debugRender is true', () => {
    let hasChanged = false;
    let parcel = new Parcel({
        value: 123,
        debugRender: true
    });

    expect(
        shallow(<ParcelBoundary parcel={parcel} debounce={100}>{(pp) => "???"}</ParcelBoundary>)
        .render()
        .get(0)
        .attribs
        .style
        .indexOf('background-color') !== -1
    ).toBe(true);
});
