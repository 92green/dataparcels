// @flow
import React from 'react';

import ParcelHoc from '../ParcelHoc';
import {CheckHockChildProps} from 'stampy/lib/util/TestHelpers';

test('ParcelHoc config should accept an initial value', () => {
    expect.assertions(2);
    CheckHockChildProps(
        ParcelHoc({
            initialValue: (props) => {
                expect(123).toBe(props.abc);
                return 456;
            },
            name: "proppy"
        }),
        {abc: 123},
        (props) => {
            expect(props.proppy.value).toBe(456);
        }
    );
});

test('ParcelHoc must be passed a name, and throw an error if it isnt', () => {
    // $FlowFixMe - intentiaal misuse of types
    expect(() => ParcelHoc({})).toThrow(`ParcelHoc() expects param "config.name" to be a string, but got undefined`);
});


test('ParcelHoc config should default initial value to undefined', () => {
    CheckHockChildProps(
        ParcelHoc({
            name: "proppy"
        }),
        {},
        (props) => {
            expect(typeof props.proppy.value === "undefined").toBe(true);
        }
    );
});

test('ParcelHoc changes should be put back into ParcelHoc state', () => {
    let Child = () => <div />;
    let Hocked = ParcelHoc({
        initialValue: () => 123,
        name: "proppy"
    })(Child);

    let wrapper = shallow(<Hocked />);
    let {proppy} = wrapper.props();
    proppy.onChange(456);
    expect(456).toBe(wrapper.update().props().proppy.value);
});

test('ParcelHoc config should accept an onChange function, and call it with the value when changed', () => {
    expect.assertions(1);
    let Child = () => <div />;
    let Hocked = ParcelHoc({
        initialValue: () => 123,
        onChange: (props) => (value) => props.onChange(value),
        name: "proppy"
    })(Child);

    let onChange = (value) => {
        expect(value).toBe(456);
    };

    let wrapper = shallow(<Hocked onChange={onChange} />);
    let {proppy} = wrapper.props();
    proppy.onChange(456);
});

test('ParcelHoc config should accept an delayUntil function, and pass undefined until this evaluates to true', () => {
    let Child = () => <div />;
    let Hocked = ParcelHoc({
        initialValue: () => 123,
        delayUntil: (props) => props.go,
        name: "proppy"
    })(Child);

    let wrapper = shallow(<Hocked go={false} />);
    expect(wrapper.props().proppy).toBe(undefined);

    wrapper.setProps({go: true});
    expect(wrapper.props().proppy.value).toBe(123);
});

test('ParcelHoc config should accept a pipe function', () => {
    expect.assertions(3);
    CheckHockChildProps(
        ParcelHoc({
            initialValue: () => 456,
            name: "proppy",
            pipe: (props) => (parcel) => {
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

test('ParcelHoc config should accept a debugRender boolean', () => {
    expect.assertions(1);
    CheckHockChildProps(
        ParcelHoc({
            initialValue: () => 456,
            name: "proppy",
            debugRender: true
        }),
        {},
        (props) => {
            expect(props.proppy._treeshare.debugRender).toBe(true);
        }
    );
});

