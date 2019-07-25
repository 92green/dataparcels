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
                return parcel.modifyDown(ii => ii + 1);
            }
        })
    ).props();

    expect(457).toBe(childProps.proppy.value);
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

test('ParcelHoc modifyBeforeUpdate should be called when value is set', () => {
    let modifyBeforeUpdate = jest.fn(value => value + 1);

    let wrapper = shallowRenderHoc(
        {},
        ParcelHoc({
            valueFromProps: () => 123,
            name: "proppy",
            modifyBeforeUpdate: [
                modifyBeforeUpdate
            ]
        })
    );

    let childProps = wrapper.props();

    // child parcel should contain value after having been passed through modifyBeforeUpdate
    expect(childProps.proppy.value).toBe(124);
});

test('ParcelHoc modifyBeforeUpdate should be called when change occurs', () => {

    let wrapper = shallowRenderHoc(
        {},
        ParcelHoc({
            valueFromProps: () => 123,
            name: "proppy",
            modifyBeforeUpdate: [
                value => value + 1,
                value => value + 1
            ]
        })
    );

    let childProps = wrapper.props();
    childProps.proppy.onChange(456);

    // child parcel should contain value after having been passed through modifyBeforeUpdate
    expect(wrapper.update().props().proppy.value).toBe(458);
});

test('ParcelHoc modifyBeforeUpdate should be called when relevant prop change occurs', () => {
    let wrapper = shallowRenderHoc(
        {},
        ParcelHoc({
            valueFromProps: () => 123,
            name: "proppy",
            modifyBeforeUpdate: [
                value => value + 1,
                value => value + 1
            ]
        })
    );

    let childProps = wrapper.props();
    childProps.proppy.onChange(456);

    // child parcel should contain value after having been passed through modifyBeforeUpdate
    expect(wrapper.update().props().proppy.value).toBe(458);
});

test('ParcelHoc modifyBeforeUpdate should be called when relevant prop change occurs', () => {

    let wrapper = shallowRenderHoc(
        {
            abc: 123
        },
        ParcelHoc({
            valueFromProps: (props) => props.abc,
            name: "proppy",
            shouldParcelUpdateFromProps: (prevProps, nextProps, valueFromProps) => valueFromProps(prevProps) !== valueFromProps(nextProps),
            modifyBeforeUpdate: [
                value => value + 1,
                value => value + 1
            ]
        })
    );

    let childProps = wrapper.props();

    // set prop that should cause a controlled update
    wrapper.setProps({
        abc: 456
    });

    let childProps2 = wrapper.props();
    // child parcel should contain value after having been passed through modifyBeforeUpdate
    expect(childProps2.proppy.value).toBe(458);
});


test('ParcelHoc config should accept a debugParcel boolean and log about receiving initial value', () => {
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
    expect(console.log.mock.calls[0][0]).toBe("ParcelHoc: Received initial value:");
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});

test('ParcelHoc config should accept a debugParcel boolean and log about changing value', () => {
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

    childProps.proppy.set("!");

    expect(console.log.mock.calls[2][0]).toBe("ParcelHoc: Parcel changed:");
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});



test('ParcelHoc config should accept a debugParcel boolean and log about updatgin from props', () => {
    let {log} = console;
    // $FlowFixMe
    console.log = jest.fn(); // eslint-disable-line
    let wrapper = shallowRenderHoc(
        {},
        ParcelHoc({
            valueFromProps: () => 456,
            name: "proppy",
            debugParcel: true,
            shouldParcelUpdateFromProps: () => true
        })
    );

    wrapper.setProps({
        def: 789
    });

    wrapper.props();

    expect(console.log.mock.calls[2][0]).toBe("ParcelHoc: Parcel updated from props:");
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});

test('ParcelHoc should not log deprecation notice when NODE_ENV=production', () => {
    let {NODE_ENV} = process.env;
    process.env.NODE_ENV = 'production';

    let {warn} = console;
    // $FlowFixMe
    console.warn = jest.fn(); // eslint-disable-line

    ParcelHoc({
        name: 'testParcel',
        valueFromProps: () => {}
    });

    expect(console.warn).not.toHaveBeenCalled();

    // $FlowFixMe
    console.warn = warn; // eslint-disable-line

    process.env.NODE_ENV = NODE_ENV;
});
