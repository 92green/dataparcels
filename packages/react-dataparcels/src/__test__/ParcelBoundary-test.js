// @flow
import React from 'react';
import ParcelBoundary from '../ParcelBoundary';
import ParcelBoundaryEquals from '../util/ParcelBoundaryEquals';
import Parcel from 'dataparcels';
import Action from 'dataparcels/Action';

jest.useFakeTimers();

test('ParcelBoundary should pass a *value equivalent* parcel to children', () => {
    let parcel = new Parcel({
        value: 123
    });
    let childRenderer = jest.fn();

    let wrapper = shallow(<ParcelBoundary parcel={parcel}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];

    expect(ParcelBoundaryEquals(childParcel, parcel)).toBe(true);
});

test('ParcelBoundary should send correct changes back up when debounce = 0', () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 456,
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);
    expect(handleChange).toHaveBeenCalledTimes(1);
    let newParcel = handleChange.mock.calls[0][0];
    expect(newParcel.value).toBe(123);
});

test('ParcelBoundary should pass a NEW *value equivalent* parcel to children when props change', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});

    let wrapper = shallow(<ParcelBoundary parcel={parcel}>
        {childRenderer}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel: parcel2
    });

    wrapper.update();

    let childParcel = childRenderer.mock.calls[0][0];
    let childParcel2 = childRenderer.mock.calls[1][0];

    expect(ParcelBoundaryEquals(childParcel, parcel)).toBe(true);
    expect(ParcelBoundaryEquals(childParcel2, parcel2)).toBe(true);
});

test('ParcelBoundary should lock state to props if debounce, hold and keepState are all false', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel({value: 123});

    let wrapper = shallow(<ParcelBoundary parcel={parcel}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.set(456);

    wrapper.update();

    expect(childRenderer).toHaveBeenCalledTimes(1);
});

test('ParcelBoundary should not rerender if parcel has not changed value and pure = true', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});

    let wrapper = shallow(<ParcelBoundary parcel={parcel} pure>
        {childRenderer}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel,
        somethingElse: true
    });

    wrapper.update();

    expect(childRenderer).toHaveBeenCalledTimes(1);
});

test('ParcelBoundary should rerender if parcel has not changed value and pure = false', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});

    let wrapper = shallow(<ParcelBoundary parcel={parcel} pure={false}>
        {childRenderer}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel,
        somethingElse: true
    });

    wrapper.update();

    expect(childRenderer).toHaveBeenCalledTimes(2);
});

test('ParcelBoundary should rerender if parcel has not changed value but forceUpdate has', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();
    let parcel2 = new Parcel({value: 456});
    let renders = 0;

    let wrapper = shallow(<ParcelBoundary parcel={parcel} forceUpdate={["abc"]}>
        {childRenderer}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel,
        forceUpdate: ["def"]
    });

    wrapper.update();

    expect(childRenderer).toHaveBeenCalledTimes(2);
});

test('ParcelBoundary should release changes when called', async () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);
    // handleChange shouldn't be called yet because hold is true
    expect(handleChange).toHaveBeenCalledTimes(0);

    wrapper.update();

    let [childParcel2, control] = childRenderer.mock.calls[1];
    // inside the parcel boundary, the last change should be applied to the parcel
    expect(childParcel2.value).toBe(123);

    control.release();

    // handleChange should be called now because release() was called
    expect(handleChange).toHaveBeenCalledTimes(1);
    let newParcel = handleChange.mock.calls[0][0];

    // handleChange should have been called with the correct value
    expect(newParcel.value).toBe(123);
});

test('ParcelBoundary should use onRelease', async () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();
    let onRelease = jest.fn();

    let parcel = new Parcel({
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold onRelease={onRelease}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);
    wrapper.update();
    childRenderer.mock.calls[1][1].release();

    // onRelease should be called now because release() was called
    expect(onRelease).toHaveBeenCalledTimes(1);
    expect(handleChange).not.toHaveBeenCalled();
    let release = onRelease.mock.calls[0][0];

    // call release and then handleChange should have been called with the correct value
    release();
    expect(handleChange).toHaveBeenCalledTimes(1);
});

test('ParcelBoundary should cancel changes when called', async () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        handleChange,
        value: 456
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);
    // handleChange shouldn't be called yet because hold is true
    expect(handleChange).toHaveBeenCalledTimes(0);

    wrapper.update();

    let [childParcel2, control] = childRenderer.mock.calls[1];
    // inside the parcel boundary, the last change should be applied to the parcel
    expect(childParcel2.value).toBe(123);

    control.cancel();

    // handleChange should still not have been called
    expect(handleChange).toHaveBeenCalledTimes(0);

    wrapper.update();


    let [childParcel3] = childRenderer.mock.calls[2];
    // inside the parcel boundary, the original value should be reinstated
    expect(childParcel3.value).toBe(456);
});

test('ParcelBoundary should onCancel', async () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();
    let onCancel = jest.fn();

    let parcel = new Parcel({
        handleChange,
        value: 456
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold onCancel={onCancel}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);
    wrapper.update();
    childRenderer.mock.calls[1][1].cancel();

    let childRendererCalls = childRenderer.mock.calls.length;

    // onCancel should be called now because cancel() was called
    expect(onCancel).toHaveBeenCalledTimes(1);

    // there should have been no re-render as the cancellation shouldn't have happened yet
    expect(childRenderer).toHaveBeenCalledTimes(childRendererCalls);
    let cancel = onCancel.mock.calls[0][0];

    // call cancel and then inside the parcel boundary, the original value should be reinstated
    cancel();
    wrapper.update();
    let [childParcel2] = childRenderer.mock.calls[2];
    // inside the parcel boundary, the original value should be reinstated
    expect(childParcel2.value).toBe(456);
});


test('ParcelBoundary cancel should do nothing if no changes have occurred', async () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        handleChange,
        value: 456
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRenderer}
    </ParcelBoundary>);

    childRenderer.mock.calls[0][1].cancel();

    wrapper.update();

    // childRenderer should still only have been called once
    // because no change of state should have occurred whatsoever
    expect(childRenderer).toHaveBeenCalledTimes(1);
});


test('ParcelBoundary should pass buffer info to childRenderer', async () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel();

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRenderer}
    </ParcelBoundary>);

    let [childParcel, control] = childRenderer.mock.calls[0];
    childParcel.onChange(123);
    // handleChange shouldn't be called yet because hold is true
    expect(control.buffered).toBe(false);
    expect(control.buffer.length).toBe(0);

    let [childParcel2, control2] = childRenderer.mock.calls[1];
    expect(control2.buffered).toBe(true);
    expect(control2.buffer.length).toBe(1);
    expect(control2.buffer[0] instanceof Action).toBe(true);

    control.release();

    let [childParcel3, control3] = childRenderer.mock.calls[2];
    expect(control3.buffered).toBe(false);
    expect(control3.buffer.length).toBe(0);
});

test('ParcelBoundary should debounce', async () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: {a:1, b:2},
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debounce={30}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];

    // make a change with a value
    childParcel.get('a').onChange(123);

    // handleChange shouldn't be called yet
    expect(handleChange).toHaveBeenCalledTimes(0);

    // wait 20ms
    jest.advanceTimersByTime(20);

    // handleChange shouldn't be called yet
    expect(handleChange).toHaveBeenCalledTimes(0);

    wrapper.update();
    let childParcel2 = childRenderer.mock.calls[1][0];

    // parcel inside parcel boundary should have updated
    expect(childParcel2.value).toEqual({a:123, b:2});

    // make another change with a value
    childParcel2.get('a').onChange(456);

    // wait another 20ms
    jest.advanceTimersByTime(20);

    // handleChange still shouldn't be called yet
    expect(handleChange).toHaveBeenCalledTimes(0);

    wrapper.update();
    let childParcel3 = childRenderer.mock.calls[2][0];

    // parcel inside parcel boundary should have updated
    expect(childParcel3.value).toEqual({a:456, b:2});

    // make another 2 changes with a value
    childParcel3.get('a').onChange(789);
    childParcel3.get('b').onChange(789);

    // wait another 40ms - with an interval this big, debounce should have finally had time to kick in
    jest.advanceTimersByTime(40);

    // handleChange should have been called
    expect(handleChange).toHaveBeenCalledTimes(1);
    // handleChange should have been called with the most recent set of changes
    expect(handleChange.mock.calls[0][0].value).toEqual({a:789, b:789});
});

test('ParcelBoundary should cancel unreleased changes when receiving a new parcel prop', () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });
    let parcel2 = new Parcel({
        value: 456,
        handleChange
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(789);

    let childParcel2 = childRenderer.mock.calls[1][0];

    // verify that the current value of the parcel has been updated
    expect(childParcel2.value).toBe(789);

    wrapper.setProps({
        parcel: parcel2
    });

    let childParcel3 = childRenderer.mock.calls[2][0];
    // the new value received via props should be passed down WITHOUT the previous 789 change applied
    expect(childParcel3.value).toBe(456);

    let control = childRenderer.mock.calls[2][1];
    control.release();

    // after release()ing the buffer, handleChange should not be called, because there should not be anything in the buffer
    expect(handleChange).toHaveBeenCalledTimes(0);
});

test('ParcelBoundary should use an internal boundary split to stop parcel boundaries using the same parcel from sharing their parcel registries', () => {
    let parcel = new Parcel({
        value: {
            abc: 123,
            def: 123
        }
    });
    let childRendererA = jest.fn();
    let childRendererB = jest.fn();

    let wrapper1 = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRendererA}
    </ParcelBoundary>);

    let wrapper2 = shallow(<ParcelBoundary parcel={parcel} hold>
        {childRendererB}
    </ParcelBoundary>);

    let childParcelA = childRendererA.mock.calls[0][0];
    childParcelA.get('abc').onChange(456);

    let childParcelB = childRendererB.mock.calls[0][0];
    childParcelB.get('def').onChange(456);

    wrapper1.update();
    wrapper2.update();

    let childParcelA2 = childRendererA.mock.calls[1][0];
    let childParcelB2 = childRendererB.mock.calls[1][0];

    expect(childParcelA2.value).toEqual({abc: 456, def: 123});
    expect(childParcelB2.value).toEqual({abc: 123, def: 456});
});

test('ParcelBoundary should ignore updates from props for updates caused by themselves if keepState is true', () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    let withModify = (parcel) => parcel.modifyUp(value => value + 1);

    let wrapper = shallow(<ParcelBoundary parcel={withModify(parcel)} keepState>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(456);

    let newParcel = handleChange.mock.calls[0][0];

    // verify that the current value of the parcel has been updated
    expect(newParcel.value).toBe(457);

    wrapper.setProps({
        parcel: withModify(newParcel)
    });

    // expect that the value in the parcelboundary has not changed
    // because the last change was triggered by this boundary
    let childParcel2 = childRenderer.mock.calls[2][0];
    expect(childParcel2.value).toBe(456);

    // make a change externally and ensure that the value in the boundary does update
    newParcel.set(789);
    let newParcel2 = handleChange.mock.calls[1][0];
    wrapper.setProps({
        parcel: withModify(newParcel2)
    });

    let childParcel3 = childRenderer.mock.calls[3][0];
    expect(childParcel3.value).toBe(789);
});

test('ParcelBoundary should pass changes through modifyBeforeUpdate', () => {
    let childRenderer = jest.fn();
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 456,
        handleChange
    });

    let modifyBeforeUpdate = [
        value => value + 1,
        value => value + 1
    ];

    let wrapper = shallow(<ParcelBoundary parcel={parcel} modifyBeforeUpdate={modifyBeforeUpdate}>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);
    expect(handleChange).toHaveBeenCalledTimes(1);
    let newParcel = handleChange.mock.calls[0][0];
    expect(newParcel.value).toBe(125);
});

test('ParcelBoundary should pass new parcel from props change through modifyBeforeUpdate', () => {
    let childRenderer = jest.fn();

    let parcel = new Parcel({value: 123});
    let parcel2 = new Parcel({value: 456});

    let modifyBeforeUpdate = [
        jest.fn(value => value + 1),
        jest.fn(value => value + 1)
    ];

    let wrapper = shallow(<ParcelBoundary parcel={parcel} modifyBeforeUpdate={modifyBeforeUpdate}>
        {childRenderer}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel: parcel2
    });

    wrapper.update();

    let childParcel = childRenderer.mock.calls[0][0];
    let childParcel2 = childRenderer.mock.calls[1][0];

    expect(modifyBeforeUpdate[0].mock.calls[0][0]).toBe(456);
    expect(modifyBeforeUpdate[0].mock.calls[0][1].prevData.value).toBe(123);
    expect(modifyBeforeUpdate[0].mock.calls[0][1].nextData.value).toBe(456);

    expect(modifyBeforeUpdate[1].mock.calls[0][0]).toBe(457);
    expect(modifyBeforeUpdate[1].mock.calls[0][1].prevData.value).toBe(123);
    expect(modifyBeforeUpdate[1].mock.calls[0][1].nextData.value).toBe(457);
});

test('ParcelBoundary should accept a debugParcel boolean and log about receiving initial value', () => {
    let {log} = console;
    // $FlowFixMe
    console.log = jest.fn(); // eslint-disable-line

    let parcel = new Parcel({
        value: 123
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debugParcel>
        {() => <div />}
    </ParcelBoundary>);

    expect(console.log.mock.calls[0][0]).toBe("ParcelBoundary: Received initial value:");
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});

test('ParcelBoundary should accept a debugParcel boolean and log about parcel changing', () => {
    let {log} = console;
    // $FlowFixMe
    console.log = jest.fn(); // eslint-disable-line
    let childRenderer = jest.fn();

    let parcel = new Parcel({
        value: 123
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debugParcel>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);

    expect(console.log.mock.calls[2][0]).toBe("ParcelBoundary: Parcel changed:");
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});

test('ParcelBoundary should accept a debugParcel boolean and log about replacing parcel from props', () => {
    let {log} = console;
    // $FlowFixMe
    console.log = jest.fn(); // eslint-disable-line

    let parcel = new Parcel({
        value: 123
    });

    let parcel2 = new Parcel({
        value: 456
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debugParcel>
        {() => <div />}
    </ParcelBoundary>);

    wrapper.setProps({
        parcel: parcel2
    });

    wrapper.update();

    expect(console.log.mock.calls[2][0]).toBe("ParcelBoundary: Parcel replaced from props:");
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});

test('ParcelBoundary should accept a debugParcel boolean and log about cancelling and reverting parcel', () => {
    let {log} = console;
    // $FlowFixMe
    console.log = jest.fn(); // eslint-disable-line
    let childRenderer = jest.fn();

    let parcel = new Parcel({
        value: 123
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debugParcel hold>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);

    wrapper.update();

    childRenderer.mock.calls[1][1].cancel();

    expect(console.log.mock.calls[4][0]).toBe("ParcelBoundary: Buffer cancelled. Parcel reverted:");
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});

test('ParcelBoundary should accept a debugBuffer boolean and log about adding to buffer', () => {
    let {log} = console;
    // $FlowFixMe
    console.log = jest.fn(); // eslint-disable-line
    let childRenderer = jest.fn();

    let parcel = new Parcel({
        value: 123
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debugBuffer hold>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);

    expect(console.log.mock.calls[0][0]).toBe("ParcelBoundary: Add to buffer:");
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});

test('ParcelBoundary should accept a debugBuffer boolean and log about releasing buffer', () => {
    let {log} = console;
    // $FlowFixMe
    console.log = jest.fn(); // eslint-disable-line
    let childRenderer = jest.fn();

    let parcel = new Parcel({
        value: 123
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debugBuffer hold>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);

    wrapper.update();

    childRenderer.mock.calls[1][1].release();

    expect(console.log.mock.calls[2][0]).toBe("ParcelBoundary: Release buffer:");
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});


test('ParcelBoundary should accept a debugBuffer boolean and log about cancelling buffer', () => {
    let {log} = console;
    // $FlowFixMe
    console.log = jest.fn(); // eslint-disable-line
    let childRenderer = jest.fn();

    let parcel = new Parcel({
        value: 123
    });

    let wrapper = shallow(<ParcelBoundary parcel={parcel} debugBuffer hold>
        {childRenderer}
    </ParcelBoundary>);

    let childParcel = childRenderer.mock.calls[0][0];
    childParcel.onChange(123);

    wrapper.update();

    childRenderer.mock.calls[1][1].cancel();

    expect(console.log.mock.calls[2][0]).toBe("ParcelBoundary: Clear buffer:");
    // $FlowFixMe
    console.log = log; // eslint-disable-line
});
