// @flow
import React from 'react';
import {Map} from 'immutable';
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


test('ParcelHoc config should throw error if valueFromProps is not provided', () => {
    expect(() => ParcelHoc({name: "proppy"})).toThrow(`ParcelHoc() expects param "config.valueFromProps" to be a function, but got undefined`);
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

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBe(456);

    // dont call onChange if the value hasnt changed
    wrapper.update().props().proppy.onChange(456);
    expect(onChange).toHaveBeenCalledTimes(1);
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

test('ParcelHoc config should accept a debugParcel boolean', () => {
    let {log} = console;
    // $FlowFixMe
    console.log = jest.fn(); // eslint-disable-line
    let childProps = shallowRenderHoc(
        {},
        ParcelHoc({
            valueFromProps: () => 456,
            name: "proppy",
            debugParcel: true
        })
    ).props();

    expect(console.log).toHaveBeenCalled();
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});

test('ParcelHoc shouldParcelUpdateFromProps should update value from props when it is returned true', () => {
    let valueFromProps = jest.fn((props) => props.abc);

    let shouldParcelUpdateFromProps = jest.fn((prevProps: *, nextProps: *, valueFromProps: Function) => valueFromProps(prevProps) !== valueFromProps(nextProps));

    let props = {
        abc: 123,
        def: 456
    };

    let wrapper = shallowRenderHoc(
        props,
        ParcelHoc({
            valueFromProps,
            name: "proppy",
            shouldParcelUpdateFromProps
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

    // shouldParcelUpdateFromProps should have been called with correct prevProps and nextProps
    expect(shouldParcelUpdateFromProps).toHaveBeenCalledTimes(1);
    expect(shouldParcelUpdateFromProps.mock.calls[0][0]).toEqual({
        abc: 123,
        def: 456
    });

    expect(shouldParcelUpdateFromProps.mock.calls[0][1]).toEqual({
        abc: 123,
        def: 789
    });

    // child parcel should still contain original result of valueFromProps
    expect(childProps2.proppy.value).toBe(123);

    // set prop that SHOULD cause a controlled update
    wrapper.setProps({
        abc: "!!!"
    });

    let childProps3 = wrapper.props();

    // shouldParcelUpdateFromProps should have been called with correct prevProps and nextProps
    expect(shouldParcelUpdateFromProps).toHaveBeenCalledTimes(2);
    expect(shouldParcelUpdateFromProps.mock.calls[1][0]).toEqual({
        abc: 123,
        def: 789
    });

    expect(shouldParcelUpdateFromProps.mock.calls[1][1]).toEqual({
        abc: "!!!",
        def: 789
    });

    // child parcel should now contain new result of valueFromProps
    expect(childProps3.proppy.value).toBe("!!!");
});

//
// segments
//

test('ParcelHoc config should work with segments', () => {

    let props = {
        fooData: {
            foo: "A",
            foo2: "B"
        },
        barData: {
            bar: "C"
        },
        otherData: {
            baz: "D"
        }
    };

    let Child = () => <div />;

    let Hocked = ParcelHoc({
        segments: [
            {
                valueFromProps: (props) => props.fooData,
                onChange: (props) => props.onFooChange,
                keys: ['foo', 'foo2']
            },
            {
                valueFromProps: (props) => props.barData,
                onChange: (props) => props.onBarChange,
                keys: ['bar']
            },
            {
                valueFromProps: (props) => props.otherData,
                onChange: (props) => props.onOtherChange
            }
        ],
        name: "proppy"
    })(Child);

    let onFooChange = jest.fn();
    let onBarChange = jest.fn();
    let onOtherChange = jest.fn();

    let wrapper = shallow(<Hocked
        {...props}
        onFooChange={onFooChange}
        onBarChange={onBarChange}
        onOtherChange={onOtherChange}
    />);

    let {proppy} = wrapper.props();

    expect(proppy.value).toEqual({
        foo: "A",
        foo2: "B",
        bar: "C",
        baz: "D"
    });

    // changing foo should only affect foo's segment
    proppy.get('foo').onChange("A!");
    expect(onFooChange).toHaveBeenCalledTimes(1);
    expect(onFooChange.mock.calls[0][0]).toEqual({
        foo: "A!",
        foo2: "B"
    });
    expect(onBarChange).not.toHaveBeenCalled();
    expect(onOtherChange).not.toHaveBeenCalled();

    proppy = wrapper.update().props().proppy;

    // changing bar should only affect bar's segment
    proppy.get('bar').onChange("C!");
    expect(onFooChange).toHaveBeenCalledTimes(1);
    expect(onBarChange).toHaveBeenCalledTimes(1);
    expect(onBarChange.mock.calls[0][0]).toEqual({
        bar: "C!"
    });
    expect(onOtherChange).not.toHaveBeenCalled();

    proppy = wrapper.update().props().proppy;

    // changing other should only affect other segment
    proppy.get('baz').onChange("D!");
    expect(onFooChange).toHaveBeenCalledTimes(1);
    expect(onBarChange).toHaveBeenCalledTimes(1);
    expect(onOtherChange).toHaveBeenCalledTimes(1);
    expect(onOtherChange.mock.calls[0][0]).toEqual({
        baz: "D!"
    });

    proppy = wrapper.update().props().proppy;

    // removing other key should only affect other segment
    proppy.delete('baz');
    expect(onFooChange).toHaveBeenCalledTimes(1);
    expect(onBarChange).toHaveBeenCalledTimes(1);
    expect(onOtherChange).toHaveBeenCalledTimes(2);
    expect(onOtherChange.mock.calls[1][0]).toEqual({});
});

test('ParcelHoc segments should use segmentsConstructor', () => {

    let props = {
        fooData: {
            foo: "A",
            foo2: "B"
        }
    };

    let childProps = shallowRenderHoc(
        props,
        ParcelHoc({
            segments: [
                {
                    valueFromProps: (props) => props.fooData,
                    keys: ['foo', 'foo2']
                }
            ],
            segmentsConstructor: value => Map(value),
            name: "proppy"
        })
    ).props();

    expect(Map.isMap(childProps.proppy.value)).toBe(true);
    expect(childProps.proppy.value.get('foo')).toBe("A");
});

test('ParcelHoc config should throw error if segments.valueFromProps doesnt return object', () => {

    let Child = () => <div />;

    let Hocked = ParcelHoc({
        segments: [
            {
                valueFromProps: (props) => [],
                keys: ['foo', 'foo2']
            }
        ],
        name: "proppy"
    })(Child);

    expect(() => shallow(<Hocked thing />)).toThrow(`Result of segment[0].valueFromProps() should be object`);
});

test('ParcelHoc segment shouldParcelUpdateFromProps should update value from props when it is returned true', () => {
    let valueFromProps = jest.fn((props) => props.abc);
    let valueFromProps2 = jest.fn(props => props);

    let shouldParcelUpdateFromProps = jest.fn((prevProps: *, nextProps: *, valueFromProps: Function) => valueFromProps(prevProps) !== valueFromProps(nextProps));
    let shouldParcelUpdateFromProps2 = jest.fn((prevProps: *, nextProps: *, valueFromProps: Function) => prevProps.bar !== nextProps.bar);

    let props = {
        abc: {
            foo: "A",
            foo2: "B",
            foo3: "C"
        },
        bar: 123,
        def: 456
    };

    let wrapper = shallowRenderHoc(
        props,
        ParcelHoc({
            name: "proppy",
            segments: [
                {
                    valueFromProps,
                    shouldParcelUpdateFromProps,
                    keys: ['foo', 'foo2']
                },
                {
                    valueFromProps: valueFromProps2,
                    shouldParcelUpdateFromProps: shouldParcelUpdateFromProps2,
                    keys: ['bar']
                }
            ]
        })
    );

    let childProps = wrapper.props();

    // valueFromProps should be props
    expect(valueFromProps.mock.calls[0][0]).toEqual(props);

    // child parcel should contain result of valueFromProps
    expect(childProps.proppy.value).toEqual({
        foo: "A",
        foo2: "B",
        bar: 123
    });

    // set prop that SHOULDN'T cause a controlled update
    wrapper.setProps({
        abc: {
            foo: "A",
            foo2: "B",
            foo3: "C!"
        }
    });

    let childProps2 = wrapper.props();

    // shouldParcelUpdateFromProps should have been called with correct prevProps and nextProps
    expect(shouldParcelUpdateFromProps).toHaveBeenCalledTimes(1);
    expect(shouldParcelUpdateFromProps.mock.calls[0][0]).toEqual({
        abc: {
            foo: "A",
            foo2: "B",
            foo3: "C"
        },
        bar: 123,
        def: 456
    });
    expect(shouldParcelUpdateFromProps.mock.calls[0][1]).toEqual({
        abc: {
            foo: "A",
            foo2: "B",
            foo3: "C!"
        },
        bar: 123,
        def: 456
    });

    // child parcel should still contain original result of valueFromProps
    expect(childProps2.proppy.value).toEqual({
        foo: "A",
        foo2: "B",
        bar: 123
    });

    // set prop that SHOULD cause a controlled update on ONE segment
     wrapper.setProps({
        abc: {
            foo: "A!",
            foo2: "B",
            foo3: "C!"
        },
        bar: 123,
        def: 456
    });

    let childProps3 = wrapper.props();

    // shouldParcelUpdateFromProps should have been called with correct prevProps and nextProps
    expect(shouldParcelUpdateFromProps).toHaveBeenCalledTimes(2);
    expect(shouldParcelUpdateFromProps.mock.calls[1][0]).toEqual({
        abc: {
            foo: "A",
            foo2: "B",
            foo3: "C!"
        },
        bar: 123,
        def: 456
    });
    expect(shouldParcelUpdateFromProps.mock.calls[1][1]).toEqual({
        abc: {
            foo: "A!",
            foo2: "B",
            foo3: "C!"
        },
        bar: 123,
        def: 456
    });

    // child parcel should now contain new result of valueFromProps
    expect(childProps3.proppy.value).toEqual({
        foo: "A!",
        foo2: "B",
        bar: 123
    });

    // set prop that SHOULD cause a controlled update on TWO segments
     wrapper.setProps({
        abc: {
            foo: "A!",
            foo2: "BBBB",
            foo3: "C!"
        },
        bar: 789,
        def: 456
    });

    let childProps4 = wrapper.props();

    // shouldParcelUpdateFromProps should have been called with correct prevProps and nextProps
    expect(shouldParcelUpdateFromProps).toHaveBeenCalledTimes(3);
    expect(shouldParcelUpdateFromProps.mock.calls[2][0]).toEqual({
        abc: {
            foo: "A!",
            foo2: "B",
            foo3: "C!"
        },
        bar: 123,
        def: 456
    });
    expect(shouldParcelUpdateFromProps.mock.calls[2][1]).toEqual({
        abc: {
            foo: "A!",
            foo2: "BBBB",
            foo3: "C!"
        },
        bar: 789,
        def: 456
    });

    // child parcel should now contain new result of valueFromProps
    expect(childProps4.proppy.value).toEqual({
        foo: "A!",
        foo2: "BBBB",
        bar: 789
    });
});
