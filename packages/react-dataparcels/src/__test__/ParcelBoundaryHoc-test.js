// @flow
import React from 'react';

import Parcel from 'dataparcels';
import ParcelBoundaryHoc from '../ParcelBoundaryHoc';
import ParcelBoundaryControl from '../ParcelBoundaryControl';

let shallowRenderHoc = (props, hock) => {
    let Component = hock((props) => <div />);
    return shallow(<Component {...props}/>);
};

test('ParcelBoundaryHoc config should pass props through', () => {
    let propsGivenToInnerComponent = shallowRenderHoc(
        {
            testParcel: new Parcel(),
            abc: 123,
            def: 456
        },
        ParcelBoundaryHoc({
            name: 'testParcel'
        })
    ).dive().props();

    expect(propsGivenToInnerComponent.abc).toBe(123);
    expect(propsGivenToInnerComponent.def).toBe(456);
});


test('ParcelBoundaryHoc config should pass props through with no parcel found', () => {
    let propsGivenToInnerComponent = shallowRenderHoc(
        {
            abc: 123,
            def: 456
        },
        ParcelBoundaryHoc({
            name: 'testParcel'
        })
    ).props();

    expect(propsGivenToInnerComponent.abc).toBe(123);
    expect(propsGivenToInnerComponent.def).toBe(456);
});


test('ParcelBoundaryHoc config should pass ParcelBoundary parcel down under same prop name', () => {
    let propsGivenToInnerComponent = shallowRenderHoc(
        {
            testParcel: new Parcel({
                value: 789
            })
        },
        ParcelBoundaryHoc({
            name: 'testParcel'
        })
    ).dive().props();

    // parcel has correct contents
    expect(propsGivenToInnerComponent.testParcel.value).toBe(789);

    // parcel is passed through parcel boundary as evidenced by "~bs" in its id
    expect(propsGivenToInnerComponent.testParcel.id.indexOf("~bs")).not.toBe(-1);
});

test('ParcelBoundaryHoc config should pass control as config.name + "Control', () => {
    let propsGivenToInnerComponent = shallowRenderHoc(
        {
            testParcel: new Parcel({
                value: 789
            })
        },
        ParcelBoundaryHoc({
            name: 'testParcel'
        })
    ).dive().props();

    // testParcelControl should contain a ParcelBoundaryControl object
    expect(propsGivenToInnerComponent.testParcelControl instanceof ParcelBoundaryControl).toBe(true);
});

test('ParcelBoundaryHoc config.name should accept props function returning string', () => {
    let propsGivenToInnerComponent = shallowRenderHoc(
        {
            testParcel: new Parcel({
                value: 789
            }),
            parcelName: 'testParcel'
        },
        ParcelBoundaryHoc({
            name: (props: Object) => props.parcelName
        })
    ).dive().props();

    // parcel has correct contents
    expect(propsGivenToInnerComponent.testParcel.value).toBe(789);

    // parcel is passed through parcel boundary as evidenced by "~bs" in its id
    expect(propsGivenToInnerComponent.testParcel.id.indexOf("~bs")).not.toBe(-1);
});

test('ParcelBoundaryHoc config.debounce should accept number', () => {
    let propsGivenToParcelBoundary = shallowRenderHoc(
        {
            testParcel: new Parcel()
        },
        ParcelBoundaryHoc({
            name: 'testParcel',
            debounce: 100
        })
    ).props();

    expect(propsGivenToParcelBoundary.debounce).toBe(100);
});

test('ParcelBoundaryHoc config.debounce should accept props function returning number', () => {
    let propsGivenToParcelBoundary = shallowRenderHoc(
        {
            testParcel: new Parcel(),
            debounce: 100
        },
        ParcelBoundaryHoc({
            name: 'testParcel',
            debounce: (props) => props.debounce
        })
    ).props();

    expect(propsGivenToParcelBoundary.debounce).toBe(100);
});

test('ParcelBoundaryHoc config.hold should accept number', () => {
    let propsGivenToParcelBoundary = shallowRenderHoc(
        {
            testParcel: new Parcel()
        },
        ParcelBoundaryHoc({
            name: 'testParcel',
            hold: true
        })
    ).props();

    expect(propsGivenToParcelBoundary.hold).toBe(true);
});

test('ParcelBoundaryHoc config.hold should accept props function returning number', () => {
    let propsGivenToParcelBoundary = shallowRenderHoc(
        {
            testParcel: new Parcel(),
            hold: true
        },
        ParcelBoundaryHoc({
            name: 'testParcel',
            hold: (props) => props.hold
        })
    ).props();

    expect(propsGivenToParcelBoundary.hold).toBe(true);
});

test('ParcelBoundaryHoc config.debugBuffer should accept number', () => {
    let propsGivenToParcelBoundary = shallowRenderHoc(
        {
            testParcel: new Parcel()
        },
        ParcelBoundaryHoc({
            name: 'testParcel',
            debugBuffer: true
        })
    ).props();

    expect(propsGivenToParcelBoundary.debugBuffer).toBe(true);
});

test('ParcelBoundaryHoc should be not use pure rendering', () => {
    let propsGivenToParcelBoundary = shallowRenderHoc(
        {
            testParcel: new Parcel()
        },
        ParcelBoundaryHoc({
            name: 'testParcel'
        })
    ).props();

    expect(propsGivenToParcelBoundary.pure).toBe(false);
});

test('ParcelBoundaryHoc should pass down originalParcel in ParcelBoundaryControl', () => {
    let testParcel = new Parcel({
        value: 789
    });

    let propsGivenToInnerComponent = shallowRenderHoc(
        {
            testParcel
        },
        ParcelBoundaryHoc({
            name: 'testParcel'
        })
    ).dive().props();

    expect(propsGivenToInnerComponent.testParcelControl.originalParcel).toBe(testParcel);
});

test('ParcelBoundaryHoc config.modifyBeforeUpdate should accept array', () => {
    let modifyBeforeUpdate = [
        value => value + 1
    ];

    let propsGivenToParcelBoundary = shallowRenderHoc(
        {
            testParcel: new Parcel()
        },
        ParcelBoundaryHoc({
            name: 'testParcel',
            modifyBeforeUpdate
        })
    ).props();

    expect(propsGivenToParcelBoundary.modifyBeforeUpdate).toBe(modifyBeforeUpdate);
});

test('ParcelBoundaryHoc config.onCancel should accept function array', () => {
    let onCancel = [continueCancel => continueCancel()];

    let propsGivenToParcelBoundary = shallowRenderHoc(
        {
            testParcel: new Parcel()
        },
        ParcelBoundaryHoc({
            name: 'testParcel',
            onCancel
        })
    ).props();

    expect(propsGivenToParcelBoundary.onCancel).toBe(onCancel);
});

test('ParcelBoundaryHoc config.onRelease should accept function array', () => {
    let onRelease = [continueRelease => continueRelease()];

    let propsGivenToParcelBoundary = shallowRenderHoc(
        {
            testParcel: new Parcel()
        },
        ParcelBoundaryHoc({
            name: 'testParcel',
            onRelease
        })
    ).props();

    expect(propsGivenToParcelBoundary.onRelease).toBe(onRelease);
});
