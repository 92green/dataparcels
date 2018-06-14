// @flow
import test from 'ava';
import React from 'react';

import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import ParcelStateHock from '../ParcelStateHock';
import {CheckHockChildProps} from 'stampy/lib/util/TestHelpers';

test('ParcelStateHock config should accept an initial value', tt => {
    tt.plan(2);
    CheckHockChildProps(
        ParcelStateHock({
            initialValue: (props) => {
                tt.is(123, props.abc, `initialValue should receive props`);
                return 456;
            },
            prop: "proppy"
        }),
        {abc: 123},
        (props) => {
            tt.is(456, props.proppy.value(), `value is passed down via prop`);
        }
    );
});

test('ParcelStateHock changes should be put back into ParcelStateHock state', tt => {
});


test('ParcelStateHock config should accept a modify function', tt => {
    tt.plan(2);
    CheckHockChildProps(
        ParcelStateHock({
            initialValue: () => 456,
            prop: "proppy",
            modify: (parcel) => {
                tt.is(456, parcel.value(), `modify should receive parcel`);
                return parcel.modifyValue(ii => ii + 1);
            }
        }),
        {},
        (props) => {
            tt.is(457, props.proppy.value(), `modified value is passed down via prop`);
        }
    );
});

test('ParcelStateHock config should accept a debugRender boolean', tt => {
    tt.plan(1);
    CheckHockChildProps(
        ParcelStateHock({
            initialValue: () => 456,
            prop: "proppy",
            debugRender: true
        }),
        {},
        (props) => {
            tt.true(props.proppy._treeshare.getDebugRender(), `debugRender is set on parcel`);
        }
    );
});
