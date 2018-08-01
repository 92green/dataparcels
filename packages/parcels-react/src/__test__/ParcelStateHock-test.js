// @flow
import test from 'ava';
import React from 'react';

import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import ParcelStateHock from '../ParcelStateHock';
import {CheckHockChildProps} from 'stampy/lib/util/TestHelpers';

test('ParcelStateHock config should accept an initial value', t => {
    t.plan(2);
    CheckHockChildProps(
        ParcelStateHock({
            initialValue: (props) => {
                t.is(123, props.abc, `initialValue should receive props`);
                return 456;
            },
            prop: "proppy"
        }),
        {abc: 123},
        (props) => {
            t.is(456, props.proppy.value(), `value is passed down via prop`);
        }
    );
});

test('ParcelStateHock must be passed a prop, and throw an error if it isnt', t => {
    // $FlowFixMe - intentiaal misuse of types
    t.is(`ParcelStateHock() expects param "config.prop" to be a string, but got undefined`, t.throws(() => ParcelStateHock({}), Error).message);
});


test('ParcelStateHock config should default initial value to undefined', t => {
    CheckHockChildProps(
        ParcelStateHock({
            prop: "proppy"
        }),
        {},
        (props) => {
            t.true(typeof props.proppy.value() === "undefined", `value is passed down via prop`);
        }
    );
});

test('ParcelStateHock changes should be put back into ParcelStateHock state', t => {
    let Child = () => <div />;
    let Hocked = ParcelStateHock({
        initialValue: () => 123,
        prop: "proppy"
    })(Child);

    let wrapper = shallow(<Hocked />);
    let {proppy} = wrapper.props();
    proppy.onChange(456);
    t.is(456, wrapper.update().props().proppy.value());
});


test('ParcelStateHock config should accept a modify function', t => {
    t.plan(3);
    CheckHockChildProps(
        ParcelStateHock({
            initialValue: () => 456,
            prop: "proppy",
            modify: (props) => (parcel) => {
                t.is(456, parcel.value(), `modify should receive parcel`);
                t.deepEqual({}, props, `modify should receive props`);
                return parcel.modifyValue(ii => ii + 1);
            }
        }),
        {},
        (props) => {
            t.is(457, props.proppy.value(), `modified value is passed down via prop`);
        }
    );
});

test('ParcelStateHock config should accept a debugRender boolean', t => {
    t.plan(1);
    CheckHockChildProps(
        ParcelStateHock({
            initialValue: () => 456,
            prop: "proppy",
            debugRender: true
        }),
        {},
        (props) => {
            t.true(props.proppy._treeshare.getDebugRender(), `debugRender is set on parcel`);
        }
    );
});
