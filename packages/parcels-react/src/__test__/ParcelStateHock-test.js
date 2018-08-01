// @flow
import React from 'react';

import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import ParcelStateHock from '../ParcelStateHock';
import {CheckHockChildProps} from 'stampy/lib/util/TestHelpers';

test('ParcelStateHock config should accept an initial value', () => {
    expect.assertions(2);
    CheckHockChildProps(
        ParcelStateHock({
            initialValue: (props) => {
                expect(123).toBe(props.abc);
                return 456;
            },
            prop: "proppy"
        }),
        {abc: 123},
        (props) => {
            expect(456).toBe(props.proppy.value());
        }
    );
});

test('ParcelStateHock must be passed a prop, and throw an error if it isnt', () => {
    // $FlowFixMe - intentiaal misuse of types
    expect(
        `ParcelStateHock() expects param "config.prop" to be a string, but got undefined`
    ).toBe(expect(() => ParcelStateHock({})).toThrowError(Error).message);
});


test('ParcelStateHock config should default initial value to undefined', () => {
    CheckHockChildProps(
        ParcelStateHock({
            prop: "proppy"
        }),
        {},
        (props) => {
            expect(typeof props.proppy.value() === "undefined").toBe(true);
        }
    );
});

test('ParcelStateHock changes should be put back into ParcelStateHock state', () => {
    let Child = () => <div />;
    let Hocked = ParcelStateHock({
        initialValue: () => 123,
        prop: "proppy"
    })(Child);

    let wrapper = shallow(<Hocked />);
    let {proppy} = wrapper.props();
    proppy.onChange(456);
    expect(456).toBe(wrapper.update().props().proppy.value());
});


test('ParcelStateHock config should accept a modify function', () => {
    expect.assertions(3);
    CheckHockChildProps(
        ParcelStateHock({
            initialValue: () => 456,
            prop: "proppy",
            modify: (props) => (parcel) => {
                expect(456).toBe(parcel.value());
                expect({}).toEqual(props);
                return parcel.modifyValue(ii => ii + 1);
            }
        }),
        {},
        (props) => {
            expect(457).toBe(props.proppy.value());
        }
    );
});

test('ParcelStateHock config should accept a debugRender boolean', () => {
    expect.assertions(1);
    CheckHockChildProps(
        ParcelStateHock({
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
