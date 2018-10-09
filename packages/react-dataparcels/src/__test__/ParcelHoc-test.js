// @flow
import React from 'react';

import ParcelHoc from '../ParcelHoc';

let shallowRenderHoc = (props, hock) => {
    let Component = hock((props) => <div />);
    return shallow(<Component {...props}/>);
};

test('ParcelHoc config should accept an initial valueFromProps', () => {
    let valueFromProps = jest.fn((props) => 456);

    let props = {
        abc: 123
    };

    let childProps = shallowRenderHoc(
        props,
        ParcelHoc({
            valueFromProps,
            name: "proppy"
        }),
        (props) => {

        }
    ).props();

    // valueFromProps should be props
    expect(valueFromProps.mock.calls[0][0]).toEqual(props);

    // child props should include a prop with the name from config.name and a value from the return of valueFromProps
    expect(childProps.proppy.value).toBe(456);
});

test('ParcelHoc must be passed a name, and throw an error if it isnt', () => {
    // $FlowFixMe - intentiaal misuse of types
    expect(() => ParcelHoc({})).toThrow(`ParcelHoc() expects param "config.name" to be a string, but got undefined`);
});


test('ParcelHoc config should default initial value to undefined', () => {
    let childProps = shallowRenderHoc(
        {},
        ParcelHoc({
            name: "proppy"
        })
    ).props();

    expect(typeof childProps.proppy.value === "undefined").toBe(true);
});

test('ParcelHoc changes should be put back into ParcelHoc state', () => {
    let Child = () => <div />;
    let Hocked = ParcelHoc({
        valueFromProps: () => 123,
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
        valueFromProps: () => 123,
        onChange: (props) => (value) => props.onChange(value),
        name: "proppy"
    })(Child);

    let onChange = jest.fn();
    let wrapper = shallow(<Hocked onChange={onChange} />);
    let {proppy} = wrapper.props();
    proppy.onChange(456);

    expect(onChange.mock.calls[0][0]).toBe(456);
});

test('ParcelHoc config should accept an delayUntil function, and pass undefined until this evaluates to true', () => {
    let Child = () => <div />;

    let Hocked = ParcelHoc({
        valueFromProps: () => 123,
        delayUntil: (props) => props.go,
        name: "proppy"
    })(Child);

    let wrapper = shallow(<Hocked go={false} />);
    expect(wrapper.props().proppy).toBe(undefined);

    wrapper.setProps({go: true});
    expect(wrapper.props().proppy.value).toBe(123);
});

test('ParcelHoc config should accept a pipe function', () => {
    let childProps = shallowRenderHoc(
        {},
        ParcelHoc({
            valueFromProps: () => 456,
            name: "proppy",
            pipe: (props) => (parcel) => {
                expect(456).toBe(parcel.value);
                expect({}).toEqual(props);
                return parcel.modifyValue(ii => ii + 1);
            }
        })
    ).props();

    expect(457).toBe(childProps.proppy.value);
});

test('ParcelHoc config should accept a debugRender boolean', () => {
    let childProps = shallowRenderHoc(
        {},
        ParcelHoc({
            valueFromProps: () => 456,
            name: "proppy",
            debugRender: true
        })
    ).props();

    expect(childProps.proppy._treeshare.debugRender).toBe(true);
});

