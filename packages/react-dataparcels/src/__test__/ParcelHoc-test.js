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
        })
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

test('ParcelHoc controlled = true should update value from props when result of valueFromProps is not strictly equal to previous result of valueFromProps', () => {
    let valueFromProps = jest.fn((props) => props.abc);

    let props = {
        abc: 123,
        def: 456
    };

    let wrapper = shallowRenderHoc(
        props,
        ParcelHoc({
            valueFromProps,
            name: "proppy",
            controlled: true
        })
    );

    let childProps = wrapper.props();

    // valueFromProps should be props
    expect(valueFromProps.mock.calls[0][0]).toEqual(props);

    // child parcel should contain result of valueFromProps
    expect(childProps.proppy.value).toBe(123);

    // set prop that SHOULDN'T cause a controlled update
    wrapper.setProps({
        def: 789
    });

    let childProps2 = wrapper.props();

    // child parcel should still contain original result of valueFromProps
    expect(childProps2.proppy.value).toBe(123);

    // set prop that SHOULD cause a controlled update
    wrapper.setProps({
        abc: "!!!"
    });

    let childProps3 = wrapper.props();

    // child parcel should now contain new result of valueFromProps
    expect(childProps3.proppy.value).toBe("!!!");
});

test('ParcelHoc controlled.shouldHocUpdate should be sued for equality while controlled', () => {
    let valueFromProps = jest.fn((props) => props.abc);

    let props = {
        abc: {
            foo: "A",
            bar: 123
        }
    };

    let wrapper = shallowRenderHoc(
        props,
        ParcelHoc({
            valueFromProps,
            name: "proppy",
            controlled: {
                shouldHocUpdate: (a: *, b: *) => a.foo !== b.foo
            }
        })
    );

    let childProps = wrapper.props();

    // set prop that SHOULDN'T cause a controlled update
    wrapper.setProps({
        abc: {
            foo: "A",
            bar: 456
        }
    });

    let childProps2 = wrapper.props();

    // child parcel should still contain original result of valueFromProps
    expect(childProps2.proppy.value).toEqual({
        foo: "A",
        bar: 123
    });

    // set prop that SHOULD cause a controlled update
    wrapper.setProps({
        abc: {
            foo: "B",
            bar: 789
        }
    });

    let childProps3 = wrapper.props();

    // child parcel should now contain new result of valueFromProps
    expect(childProps3.proppy.value).toEqual({
        foo: "B",
        bar: 789
    });
});
