// @flow
import type ChangeRequest from '../../change/ChangeRequest';

import Parcel from '../Parcel';
import StaticParcel from '../../staticParcel/StaticParcel';
import TestValidateValueUpdater from '../../util/__test__/TestValidateValueUpdater-testUtil';

test('Parcel.modifyDown() should return a new parcel with updated parcelData', () => {
    expect.assertions(2);
    var data = {
        value: [123]
    };
    var parcel = new Parcel(data).get(0);
    var updated = parcel
        .modifyDown((value: *, parcelData: Parcel) => {
            expect(parcelData).toBe(parcel);
            return value + 1;
        })
        .data;

    var expectedData = {
        meta: {},
        child: undefined,
        value: 124,
        key: "#a"
    };
    expect(expectedData).toEqual(updated);
});

test('Parcel.modifyDown() should allow non-parent types to be returned', () => {
    let updatedValue = new Parcel({
        value: 123
    })
        .modifyDown(value => value + 1)
        .value;

    expect(updatedValue).toEqual(124);
});

test('Parcel.modifyDown() should validate value updater', () => {
    TestValidateValueUpdater(
        expect,
        (value, updater) => new Parcel({value}).modifyDown(updater).value
    );
});

test('Parcel.modifyDown() should recognise if value changes types, and set value if type changes', () => {
    let handleChange = jest.fn();
    let parcel = new Parcel({
        value: 123,
        handleChange
    })
        .modifyDown(value => [])
        .push(123);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value).toEqual([123]);
});

test('Parcel.modifyDown() should have id which is unique to updater', () => {
    let updater = value => [];
    let parcel = new Parcel().modifyDown(updater);
    let parcel2 = new Parcel().modifyDown(updater);
    let parcel3 = new Parcel().modifyDown(a => 1 + 2);

    expect(parcel.id).toBe("^.~mv-643198612");
    expect(parcel2.id).toBe("^.~mv-643198612"); // same updater should produce the same hash
    expect(parcel3.id).not.toBe("^.~mv-643198612"); // different updater should produce different hash
});

test('Parcel.modifyChange() should allow you to change the payload of a changed parcel', () => {
    expect.assertions(1);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value} = parcel.data;
            expect(457).toBe(value);
        }
    };

    new Parcel(data)
        .modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {
            parcel.set(changeRequest.nextData.value + 1);
        })
        .onChange(456);
});

test('Parcel.modifyChange() should allow you to stop a change by not calling dispatch', () => {
    var handleChange = jest.fn();

    var data = {
        value: 123,
        handleChange
    };

    new Parcel(data)
        .modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {
            // nothing here
        })
        .onChange(456);

    expect(handleChange).toHaveBeenCalledTimes(0);
});

test('Parcel.modifyChange() should have id which is unique to updater', () => {
    let updater = value => [];
    let parcel = new Parcel().modifyChange(updater);
    let parcel2 = new Parcel().modifyChange(updater);
    let parcel3 = new Parcel().modifyChange(a => "woop");

    expect(parcel.id).toBe("^.~mcb-643198612");
    expect(parcel2.id).toBe("^.~mcb-643198612"); // same updater should produce the same hash
    expect(parcel3.id).not.toBe("^.~mcb-643198612"); // different updater should produce different hash
});

test('Parcel.modifyUp() should allow you to change the payload of a changed parcel with an updater (and should allow non-parent types to be returned)', () => {
    var handleChange = jest.fn();
    new Parcel({
        value: 123,
        handleChange
    })
        .modifyUp(value => value + 1)
        .onChange(456);

    expect(handleChange.mock.calls[0][0].value).toBe(457);
});


test('Parcel.modifyUp() should validate value updater', () => {
    TestValidateValueUpdater(
        expect,
        (value, updater) => new Parcel({value: undefined}).modifyUp(updater).onChange(value)
    );
});

test('Parcel.modifyUp() should allow changes to meta through', () => {
    expect.assertions(2);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value, meta} = parcel.data;
            expect(457).toBe(value);
            expect({abc: 123}).toEqual(meta);
        }
    };

    new Parcel(data)
        .modifyUp(value => value + 1)
        .batch(parcel => {
            parcel.onChange(456);
            parcel.setMeta({
                abc: 123
            });
        });
});

test('Parcel.modifyShapeDown() should be called with static parcel and return with no change', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(staticParcel => staticParcel);

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let {value} = parcel
        .modifyShapeDown(updater)
        .data;

    let expectedValue = [1,2,3];

    expect(value).toEqual(expectedValue);
    expect(updater.mock.calls[0][0] instanceof StaticParcel).toBe(true);
    expect(updater.mock.calls[0][0].data.value).toEqual(expectedValue);
});

test('Parcel.modifyShapeDown() should modify value', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(staticParcel => staticParcel.push(4));

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let parcelWithModifier = parcel.modifyShapeDown(updater);
    let {value} = parcelWithModifier.data;
    parcelWithModifier.push(5);

    expect(value).toEqual([1,2,3,4]);
    expect(handleChange.mock.calls[0][0].data.value).toEqual([1,2,3,4,5]);
});

test('Parcel.modifyShapeUp() should be called with static parcel and return with no change', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(staticParcel => staticParcel);

    let parcel = new Parcel({
        handleChange,
        value: 123
    });

    let parcelWithModifier = parcel.modifyShapeUp(updater);
    let {value} = parcelWithModifier.data;

    expect(value).toEqual(123);
    expect(updater).not.toHaveBeenCalled();

    parcelWithModifier.set(456);

    expect(updater.mock.calls[0][0] instanceof StaticParcel).toBe(true);
    expect(updater.mock.calls[0][0].data.value).toEqual(456);
});

test('Parcel.modifyShapeUp() should modify value', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(staticParcel => staticParcel.push(5));

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let parcelWithModifier = parcel.modifyShapeUp(updater);
    let {value} = parcelWithModifier.data;

    expect(value).toEqual([1,2,3]);
    expect(updater).not.toHaveBeenCalled();

    parcelWithModifier.push(4);

    expect(updater.mock.calls[0][0] instanceof StaticParcel).toBe(true);
    expect(handleChange.mock.calls[0][0].data.value).toEqual([1,2,3,4,5]);
});

test('Parcel.initialMeta() should work', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    }).initialMeta({a:1, b:2});

    expect(parcel.data).toEqual({
        value: 123,
        meta: {
            a: 1,
            b: 2
        },
        child: undefined,
        key: "^"
    });

    parcel.setMeta({b: 3});

    expect(handleChange.mock.calls[0][0].data).toEqual({
        value: 123,
        meta: {
            a: 1,
            b: 3
        },
        child: undefined,
        key: "^"
    });
});

test('Parcel.initialMeta() should merge', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    })
        .initialMeta({a:1, b:2})
        .initialMeta({b:3, c:4})

    expect(parcel.data).toEqual({
        value: 123,
        meta: {
            a: 1,
            b: 2,
            c: 4
        },
        child: undefined,
        key: "^"
    });

    parcel.setMeta({d: 5});

    expect(handleChange.mock.calls[0][0].data).toEqual({
        value: 123,
        meta: {
            a: 1,
            b: 2,
            c: 4,
            d: 5
        },
        child: undefined,
        key: "^"
    });
});

test('Parcel.initialMeta() should do nothing to data if all meta keys are already set', () => {

    let parcel = new Parcel({
        value: 123
    }).initialMeta({a:1, b:2});

    let parcel2 = parcel.initialMeta({a:1, b:2});

    expect(parcel2.data).toEqual(parcel.data);
});

test('Sanity check: A big strange test of a big strange chain of deep updatery stuff', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(value => value + "333");

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    })
        .modifyShapeDown(staticParcel => staticParcel.children().reverse()) // 1. reverse the elements in the parcel (value: [3,2,1])
        .modifyShapeUp(staticParcel => staticParcel.children().reverse()) // 6. reverse the elements in the parcel (value: [3333,2,1])
        .get(0) // 2. get the first element (value: 3)
        .modifyDown(value => value + "") // 3. cast number to string value: "3")
        .modifyUp(value => parseInt(value, 10)) // 5. cast string to number (value will be: 3333)
        .update(updater); // 4. make a change to the data, append three threes (value will be: "3333")

    expect(updater.mock.calls[0][0]).toBe("3");
    expect(handleChange.mock.calls[0][0].value).toEqual([1,2,3333]);
});
