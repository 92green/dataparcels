// @flow
import test from 'ava';
import React from 'react';

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import {shallow} from 'enzyme';
import PureParcel from '../PureParcel';
import PureParcelEquals from '../util/PureParcelEquals';
import Parcel from 'parcels';

test('PureParcel should pass a *value equivalent* parcel to children', t => {
    t.plan(1);
    let parcel = new Parcel();

    let wrapper = shallow(<PureParcel parcel={parcel}>
        {(pp) => {
            t.true(PureParcelEquals(pp, parcel));
        }}
    </PureParcel>);
});

test('PureParcel should send correct changes back up when debounce = 0', t => {
    t.plan(2);
    let hasChanged = false;
    let parcel = new Parcel({
        value: 456,
        handleChange: (newParcel) => {
            hasChanged = true;
            t.is(123, newParcel.value(), `handleChange receives correct value`);
        }
    });

    let wrapper = shallow(<PureParcel parcel={parcel}>
        {(pp) => {
            pp.onChange(123);
            t.true(hasChanged, `onChange works synchronously when debounce = 0 (handleChange should already be called by this point)`)
        }}
    </PureParcel>);
});

test('PureParcel should pass a NEW *value equivalent* parcel to children when props change', t => {
    t.plan(2);
    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

    let wrapper = shallow(<PureParcel parcel={parcel}>
        {(pp) => {
            if(renders === 0) {
                t.true(PureParcelEquals(pp, parcel));
            } else if(renders === 1) {
                t.true(PureParcelEquals(pp, parcel2));
            }
            renders++;
        }}
    </PureParcel>);

    wrapper.setProps({
        parcel: parcel2
    });
});

test('PureParcel should not rerender if parcel has not changed value', t => {
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

    t.is(renders, 1);
});

test('PureParcel should rerender if parcel has not changed value but forceUpdate has', t => {
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

    t.is(renders, 2);
});

test('PureParcel should debounce', async t => {
    t.plan(5);
    return new Promise((resolve) => {
        let handleChangeCalls = 0;
        let parcel = new Parcel({
            handleChange: (newParcel) => {
                handleChangeCalls++;
                t.is(newParcel.value(), 789, 'parcel should send correct changes back up when debouncing');
            }
        });

        let renders = 0;

        let wrapper = shallow(<PureParcel parcel={parcel} debounce={30}>
            {(pp) => {
                if(renders === 0) {
                    pp.onChange(123);
                } else if(renders === 1) {
                    t.is(123, pp.value(), 'parcel should receive correct value on 1st re-render');
                    pp.onChange(456);
                } else if(renders === 2) {
                    t.is(456, pp.value(), 'parcel should receive correct value on 2nd re-render');
                    pp.onChange(789);
                } else if(renders === 3) {
                    t.is(789, pp.value(), 'parcel should receive correct value on 3rd re-render');
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
            t.is(handleChangeCalls, 1, 'handleChange should have been called just once');
            wrapper.instance().forceUpdate();
            wrapper.update().render();
            resolve();
        }, 1000);
    });
});

test('PureParcel should ignore debounce when sending a ping', t => {
    t.plan(2);
    let hasChanged = false;
    let parcel = new Parcel({
        value: 123,
        handleChange: (newParcel) => {
            hasChanged = true;
            t.is(123, newParcel.value(), `handleChange receives correct value`);
        }
    });

    let wrapper = shallow(<PureParcel parcel={parcel} debounce={100}>
        {(pp) => {
            pp.ping();
            t.true(hasChanged, `onChange works synchronously when debounce is set and ping is sent (handleChange should already be called by this point)`)
        }}
    </PureParcel>);
});

test('PureParcel should render colours when debugRender is true', t => {
    let hasChanged = false;
    let parcel = new Parcel({
        value: 123,
        debugRender: true
    });

    t.true(
        shallow(<PureParcel parcel={parcel} debounce={100}>{(pp) => "???"}</PureParcel>)
        .render()
        .get(0)
        .attribs
        .style
        .indexOf('background-color') !== -1
    );
});

