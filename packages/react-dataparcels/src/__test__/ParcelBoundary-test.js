// @flow
import React from 'react';

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import {shallow} from 'enzyme';
import ParcelBoundary from '../ParcelBoundary';
import ParcelBoundaryEquals from '../util/ParcelBoundaryEquals';
import Parcel from 'dataparcels';

test('ParcelBoundary should pass a *value equivalent* parcel to children', () => {
    let parcel = new Parcel();
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
    expect(handleChange.mock.calls.length).toBe(1);
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

    expect(childRenderer.mock.calls.length).toBe(1);
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

    expect(childRenderer.mock.calls.length).toBe(2);
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

    expect(childRenderer.mock.calls.length).toBe(2);
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
    expect(handleChange.mock.calls.length).toBe(0);

    wrapper.update();

    let [childParcel2, actions] = childRenderer.mock.calls[1];
    // inside the parcel boundary, the last change should be applied to the parcel
    expect(childParcel2.value).toBe(123);

    actions.release();

    // handleChange should be called now because release() was called
    expect(handleChange.mock.calls.length).toBe(1);
    let newParcel = handleChange.mock.calls[0][0];

    // handleChange should have been called with the correct value
    expect(newParcel.value).toBe(123);
});

test('ParcelBoundary should debounce', async () => {
    expect.assertions(5);
    return new Promise((resolve) => {
        let handleChangeCalls = 0;
        let parcel = new Parcel({
            value: {a:1, b:2},
            handleChange: (newParcel, changeRequest) => {
                handleChangeCalls++;
                expect(newParcel.value).toEqual({a:789, b:789});
            }
        });

        let renders = 0;

        let wrapper = shallow(<ParcelBoundary parcel={parcel} debounce={30}>
            {(pp) => {
                if(renders === 0) {
                    pp.get('a').onChange(123);
                } else if(renders === 1) {
                    expect(pp.value).toEqual({a:123, b:2});
                    pp.get('a').onChange(456);
                } else if(renders === 2) {
                    expect(pp.value).toEqual({a:456, b:2});
                    pp.get('a').onChange(789);
                    pp.get('b').onChange(789);
                } else if(renders === 3) {
                    expect(pp.value).toEqual({a:789, b:789});
                }
                renders++;
            }}
        </ParcelBoundary>);

        setTimeout(() => {
            wrapper.instance().forceUpdate();
            wrapper.update().render();
        }, 20);

        setTimeout(() => {
            wrapper.instance().forceUpdate();
            wrapper.update().render();
        }, 40);

        setTimeout(() => {
            wrapper.instance().forceUpdate();
            wrapper.update().render();
        }, 60);

        setTimeout(() => {
            expect(handleChangeCalls).toBe(1);
            wrapper.instance().forceUpdate();
            wrapper.update().render();
            resolve();
        }, 1000);
    });
});

test('ParcelBoundary should not send changes up when hold = true', async () => {
    let handleChange = jest.fn();
    let childRenderer = jest.fn();

    let handleChangeCalls = 0;
    let parcel = new Parcel({
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRenderer}
    </ParcelBoundary>);

    let childRendererParcel = childRenderer.mock.calls[0][0];
    childRendererParcel.onChange(123);
    wrapper.update();

    expect(handleChange.mock.calls.length).toBe(0);
    expect(childRenderer.mock.calls.length).toBe(2);
    expect(childRenderer.mock.calls[1][0].value).toEqual(123);
});

test('ParcelBoundary should ignore debounce when sending a ping', () => {
    expect.assertions(2);
    let hasChanged = false;
    let parcel = new Parcel({
        value: 123,
        handleChange: (newParcel) => {
            hasChanged = true;
            expect(123).toBe(newParcel.value);
        }
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debounce={100}>
        {(pp) => {
            pp.ping();
            expect(hasChanged).toBe(true)
        }}
    </ParcelBoundary>);
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
