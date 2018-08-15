// @flow
import React from 'react';

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import {shallow} from 'enzyme';
import PureParcel from '../PureParcel';
import PureParcelEquals from '../util/PureParcelEquals';
import Parcel from 'dataparcels';

test('PureParcel should pass a *value equivalent* parcel to children', () => {
    expect.assertions(1);
    let parcel = new Parcel();

    let wrapper = shallow(<PureParcel parcel={parcel}>
        {(pp) => {
            expect(PureParcelEquals(pp, parcel)).toBe(true);
        }}
    </PureParcel>);
});

test('PureParcel should send correct changes back up when debounce = 0', () => {
    expect.assertions(2);
    let hasChanged = false;
    let parcel = new Parcel({
        value: 456,
        handleChange: (newParcel) => {
            hasChanged = true;
            expect(123).toBe(newParcel.value);
        }
    });

    let wrapper = shallow(<PureParcel parcel={parcel}>
        {(pp) => {
            pp.onChange(123);
            expect(hasChanged).toBe(true)
        }}
    </PureParcel>);
});

test('PureParcel should pass a NEW *value equivalent* parcel to children when props change', () => {
    expect.assertions(2);
    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

    let wrapper = shallow(<PureParcel parcel={parcel}>
        {(pp) => {
            if(renders === 0) {
                expect(PureParcelEquals(pp, parcel)).toBe(true);
            } else if(renders === 1) {
                expect(PureParcelEquals(pp, parcel2)).toBe(true);
            }
            renders++;
        }}
    </PureParcel>);

    wrapper.setProps({
        parcel: parcel2
    });
});

test('PureParcel should not rerender if parcel has not changed value', () => {
    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

    let wrapper = shallow(<PureParcel parcel={parcel}>
        {(pp) => {
            renders++;
        }}
    </PureParcel>);

    wrapper.setProps({
        parcel,
        somethingElse: true
    });

    expect(renders).toBe(1);
});

test('PureParcel should rerender if parcel has not changed value but forceUpdate has', () => {
    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

    let wrapper = shallow(<PureParcel parcel={parcel} forceUpdate={["abc"]}>
        {(pp) => {
            renders++;
        }}
    </PureParcel>);

    wrapper.setProps({
        parcel,
        forceUpdate: ["def"]
    });

    expect(renders).toBe(2);
});

test('PureParcel should debounce', async () => {
    expect.assertions(5);
    return new Promise((resolve) => {
        let handleChangeCalls = 0;
        let parcel = new Parcel({
            handleChange: (newParcel) => {
                handleChangeCalls++;
                expect(newParcel.value).toBe(789);
            }
        });

        let renders = 0;

        let wrapper = shallow(<PureParcel parcel={parcel} debounce={30}>
            {(pp) => {
                if(renders === 0) {
                    pp.onChange(123);
                } else if(renders === 1) {
                    expect(123).toBe(pp.value);
                    pp.onChange(456);
                } else if(renders === 2) {
                    expect(456).toBe(pp.value);
                    pp.onChange(789);
                } else if(renders === 3) {
                    expect(789).toBe(pp.value);
                }
                renders++;
            }}
        </PureParcel>);

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

test('PureParcel should ignore debounce when sending a ping', () => {
    expect.assertions(2);
    let hasChanged = false;
    let parcel = new Parcel({
        value: 123,
        handleChange: (newParcel) => {
            hasChanged = true;
            expect(123).toBe(newParcel.value);
        }
    });

    let wrapper = shallow(<PureParcel parcel={parcel} debounce={100}>
        {(pp) => {
            pp.ping();
            expect(hasChanged).toBe(true)
        }}
    </PureParcel>);
});

test('PureParcel should render colours when debugRender is true', () => {
    let hasChanged = false;
    let parcel = new Parcel({
        value: 123,
        debugRender: true
    });

    expect(
        shallow(<PureParcel parcel={parcel} debounce={100}>{(pp) => "???"}</PureParcel>)
        .render()
        .get(0)
        .attribs
        .style
        .indexOf('background-color') !== -1
    ).toBe(true);
});

