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

test('PureParcel should send correct changes back up when debounce = 0', tt => {
    tt.plan(2);
    let hasChanged = false;
    let parcel = new Parcel({
        value: 456,
        handleChange: (newParcel) => {
            hasChanged = true;
            tt.is(123, newParcel.value(), `handleChange receives correct value`);
        }
    });

    let wrapper = shallow(<PureParcel parcel={parcel}>
        {(pp) => {
            pp.onChange(123);
            tt.true(hasChanged, `onChange works synchronously when debounce = 0 (handleChange should already be called by this point)`)
        }}
    </PureParcel>);
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
    tt.plan(5);
    return new Promise((resolve) => {
        let handleChangeCalls = 0;
        let parcel = new Parcel({
            handleChange: (newParcel) => {
                handleChangeCalls++;
                tt.is(newParcel.value(), 789, 'parcel should send correct changes back up when debouncing');
            }
        });

        let renders = 0;

        let wrapper = shallow(<PureParcel parcel={parcel} debounce={30}>
            {(pp) => {
                if(renders === 0) {
                    pp.onChange(123);
                } else if(renders === 1) {
                    tt.is(123, pp.value(), 'parcel should receive correct value on 1st re-render');
                    pp.onChange(456);
                } else if(renders === 2) {
                    tt.is(456, pp.value(), 'parcel should receive correct value on 2nd re-render');
                    pp.onChange(789);
                } else if(renders === 3) {
                    tt.is(789, pp.value(), 'parcel should receive correct value on 3rd re-render');
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
            tt.is(handleChangeCalls, 1, 'handleChange should have been called just once');
            wrapper.instance().forceUpdate();
            wrapper.update().render();
            resolve();
        }, 1000);
    });
});
