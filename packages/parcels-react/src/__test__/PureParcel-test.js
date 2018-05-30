// @flow
import test from 'ava';
import React from 'react';

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import {shallow} from 'enzyme';
import PureParcel from '../PureParcel';
import Parcel from 'parcels';

test('PureParcel should pass a *value equivalent* parcel to children', tt => {
    tt.plan(1);
    let parcel = new Parcel();

    let wrapper = shallow(<PureParcel parcel={parcel}>
        {(pp) => {
            tt.true(pp.equals(parcel));
        }}
    </PureParcel>);
});

test('PureParcel should send correct changes back up', async tt => {
    tt.plan(2);
    return new Promise((resolve) => {
        let parcel = new Parcel({
            value: 456,
            handleChange: (newParcel) => {
                tt.is(newParcel.value(), 123);
            }
        });

        let renders = 0;

        let wrapper = shallow(<PureParcel parcel={parcel}>
            {(pp) => {
                if(renders === 0) {
                    pp.onChange(123);
                } else if(renders === 1) {
                    tt.is(pp.value(), 123);
                }
                renders++;
            }}
        </PureParcel>);

        setTimeout(() => {
            wrapper.instance().forceUpdate();
            wrapper.update().render();
            resolve();
        }, 1000);
    });
});

test('PureParcel should pass a NEW *value equivalent* parcel to children when props change', tt => {
    tt.plan(2);
    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

    let wrapper = shallow(<PureParcel parcel={parcel}>
        {(pp) => {
            if(renders === 0) {
                tt.true(pp.equals(parcel));
            } else if(renders === 1) {
                tt.true(pp.equals(parcel2));
            }
            renders++;
        }}
    </PureParcel>);

    wrapper.setProps({
        parcel: parcel2
    });
});

test('PureParcel should not rerender if parcel has not changed value', tt => {
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

    tt.is(renders, 1);
});

test('PureParcel should rerender if parcel has not changed value but forceUpdate has', tt => {
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

    tt.is(renders, 2);
});

test('PureParcel should debounce', async tt => {
    tt.plan(3);
    return new Promise((resolve) => {
        let handleChangeCalls = 0;
        let parcel = new Parcel({
            handleChange: (newParcel) => {
                handleChangeCalls++;
                tt.is(newParcel.value(), 789);
            }
        });

        let renders = 0;

        let wrapper = shallow(<PureParcel parcel={parcel} debounce={30}>
            {(pp) => {
                if(renders === 0) {
                    pp.onChange(123);
                } else if(renders === 1) {
                    pp.onChange(456);
                } else if(renders === 2) {
                    pp.onChange(789);
                } else if(renders === 3) {
                    tt.is(pp.value(), 789);
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
            tt.is(handleChangeCalls, 1);
            wrapper.instance().forceUpdate();
            wrapper.update().render();
            resolve();
        }, 1000);
    });
});
