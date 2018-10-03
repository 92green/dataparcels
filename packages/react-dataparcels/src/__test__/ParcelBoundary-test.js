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
    expect.assertions(1);
    let parcel = new Parcel();
    let childRenderer = jest.fn();

    let wrapper = shallow(<ParcelBoundary parcel={parcel}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];

    expect(ParcelBoundaryEquals(childParcel, parcel)).toBe(true);
});

test('ParcelBoundary should send correct changes back up when debounce = 0', () => {
    expect.assertions(2);
    let childRenderer = jest.fn();
    let handleChange = jest.fn();
    let hasChanged = false;

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
    expect.assertions(2);
    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

    let wrapper = shallow(<ParcelBoundary parcel={parcel}>
        {(pp) => {
            if(renders === 0) {
                expect(ParcelBoundaryEquals(pp, parcel)).toBe(true);
            } else if(renders === 1) {
                expect(ParcelBoundaryEquals(pp, parcel2)).toBe(true);
            }
            renders++;
        }}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel: parcel2
    });
});

test('ParcelBoundary should not rerender if parcel has not changed value and pure = true', () => {
    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

    let wrapper = shallow(<ParcelBoundary parcel={parcel} pure>
        {(pp) => {
            renders++;
        }}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel,
        somethingElse: true
    });

    expect(renders).toBe(1);
});

test('ParcelBoundary should rerender if parcel has not changed value and pure = false', () => {
    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

    let wrapper = shallow(<ParcelBoundary parcel={parcel} pure={false}>
        {(pp) => {
            renders++;
        }}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel,
        somethingElse: true
    });

    expect(renders).toBe(2);
});

test('ParcelBoundary should rerender if parcel has not changed value but forceUpdate has', () => {
    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

    let wrapper = shallow(<ParcelBoundary parcel={parcel} forceUpdate={["abc"]}>
        {(pp) => {
            renders++;
        }}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel,
        forceUpdate: ["def"]
    });

    expect(renders).toBe(2);
});

test('ParcelBoundary should release changes when called', async () => {
    let handleChangeCalls = 0;
    expect.assertions(2);
    return new Promise((resolve) => {
        let parcel = new Parcel({
            handleChange: (newParcel) => {
                handleChangeCalls++;
                expect(newParcel.value).toBe(123);
            }
        });

        let renders = 0;

        let wrapper = shallow(<ParcelBoundary parcel={parcel} hold={true}>
            {(pp, {release}) => {
                if(renders === 0) {
                    pp.onChange(123);
                } else if(renders === 1) {
                    release();
                }
                renders++;
            }}
        </ParcelBoundary>);

        expect(handleChangeCalls).toBe(0);

        setTimeout(() => {
            wrapper.instance().forceUpdate();
            wrapper.update().render();
            resolve();
        }, 20);
    });
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
