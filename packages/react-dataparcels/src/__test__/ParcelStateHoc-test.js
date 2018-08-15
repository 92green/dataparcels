// @flow
import React from 'react';

import ParcelStateHoc from '../ParcelStateHoc';
import {CheckHockChildProps} from 'stampy/lib/util/TestHelpers';

test('ParcelStateHoc config should accept an initial value', () => {
    expect.assertions(2);
    CheckHockChildProps(
        ParcelStateHoc({
            initialValue: (props) => {
                expect(123).toBe(props.abc);
                return 456;
            },
            prop: "proppy"
        }),
        {abc: 123},
        (props) => {
            expect(456).toBe(props.proppy.value);
        }
    );
});

test('ParcelStateHoc must be passed a prop, and throw an error if it isnt', () => {
    // $FlowFixMe - intentiaal misuse of types
    expect(() => ParcelStateHoc({})).toThrow(`ParcelStateHoc() expects param "config.prop" to be a string, but got undefined`);
});


test('ParcelStateHoc config should default initial value to undefined', () => {
    CheckHockChildProps(
        ParcelStateHoc({
            prop: "proppy"
        }),
        {},
        (props) => {
            expect(typeof props.proppy.value === "undefined").toBe(true);
        }
    );
});

test('ParcelStateHoc changes should be put back into ParcelStateHoc state', () => {
    let Child = () => <div />;
    let Hocked = ParcelStateHoc({
        initialValue: () => 123,
        prop: "proppy"
    })(Child);

    let wrapper = shallow(<Hocked />);
    let {proppy} = wrapper.props();
    proppy.onChange(456);
    expect(456).toBe(wrapper.update().props().proppy.value);
});


test('ParcelStateHoc config should accept a modify function', () => {
    expect.assertions(3);
    CheckHockChildProps(
        ParcelStateHoc({
            initialValue: () => 456,
            prop: "proppy",
            modify: (props) => (parcel) => {
                expect(456).toBe(parcel.value);
                expect({}).toEqual(props);
                return parcel.modifyValue(ii => ii + 1);
            }
        }),
        {},
        (props) => {
            expect(457).toBe(props.proppy.value);
        }
    );
});

test('ParcelStateHoc config should accept a debugRender boolean', () => {
    expect.assertions(1);
    CheckHockChildProps(
        ParcelStateHoc({
            initialValue: () => 456,
            prop: "proppy",
            debugRender: true
        }),
        {},
        (props) => {
            expect(props.proppy._treeshare.getDebugRender()).toBe(true);
        }
    );
});
