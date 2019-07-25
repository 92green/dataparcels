// @flow
import update from 'unmutable/lib/update';

import ChangeRequest from '../../change/ChangeRequest';
import Parcel from '../Parcel';
import ParcelShape from '../../parcelShape/ParcelShape';
import CancelActionMarker from '../../change/CancelActionMarker';
import asShape from '../../parcelShape/asShape';
import TestValidateValueUpdater from '../../util/__test__/TestValidateValueUpdater-testUtil';

test('Parcel.modifyDown() should return a new parcel with updated parcelData', () => {
    let updater = jest.fn(value => value + 1);
    var data = {
        value: [123]
    };
    var parcel = new Parcel(data).get(0);
    var updated = parcel
        .modifyDown(updater)
        .data;

    var expectedData = {
        meta: {},
        child: undefined,
        value: 124,
        key: "#a"
    };
    expect(expectedData).toEqual(updated);
    expect(updater.mock.calls[0][0]).toBe(123);
    expect(updater.mock.calls[0][1]).toBe(undefined);
});

test('Parcel.modifyDown() should not destroy child data', () => {
    let handleChange = jest.fn();
    let updater = jest.fn(value => value + 1);

    var parcel = new Parcel({
        value: [123],
        handleChange
    })
        .get(0)
        .setMeta({def: 456});

    let newParcel = handleChange.mock.calls[0][0].modifyDown(ii => ii);

    expect(newParcel.data.child).toEqual([
        {
            key: '#a',
            child: undefined,
            meta: {
                def: 456
            }
        }
    ]);
});

test('Parcel.modifyDown() should allow non-parent types to be returned', () => {
    let updatedValue = new Parcel({
        value: 123
    })
        .modifyDown(value => value + 1)
        .value;

    expect(updatedValue).toEqual(124);
});

test('Parcel.modifyDown() should allow undefined to be returned (unlike modifyUp(parcelShapeUpdater))', () => {
    let updatedValue = new Parcel({
        value: 123
    })
        .modifyDown(() => {})
        .value;

    expect(updatedValue).toEqual(undefined);
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
    let sameA1 = new Parcel().modifyDown(updater);
    let sameA2 = new Parcel().modifyDown(updater);
    let differentA = new Parcel().modifyDown(a => 1 + 2);

    let sameB1 = new Parcel().modifyDown(asShape(updater));
    let sameB2 = new Parcel().modifyDown(asShape(updater));
    let differentB = new Parcel().modifyDown(asShape(a => 1 + 2));

    expect(sameA1.id).toBe(sameA2.id);
    expect(sameA1.id).not.toBe(differentA.id);
    expect(sameB1.id).toBe(sameB2.id);
    expect(sameB1.id).not.toBe(differentB.id);
});

test('Parcel.modifyUp() should have id which is unique to updater', () => {
    let updater = value => [];
    let sameA1 = new Parcel().modifyUp(updater);
    let sameA2 = new Parcel().modifyUp(updater);
    let differentA = new Parcel().modifyUp(a => 1 + 2);

    let sameB1 = new Parcel().modifyUp(asShape(updater));
    let sameB2 = new Parcel().modifyUp(asShape(updater));
    let differentB = new Parcel().modifyUp(asShape(a => 1 + 2));

    expect(sameA1.id).toBe(sameA2.id);
    expect(sameA1.id).not.toBe(differentA.id);
    expect(sameB1.id).toBe(sameB2.id);
    expect(sameB1.id).not.toBe(differentB.id);
});

test('Parcel.modifyUp() should allow you to change the payload of a changed parcel with an updater (and should allow non-parent types to be returned)', () => {
    let handleChange = jest.fn();
    let updater = jest.fn(value => value + 1);

    new Parcel({
        value: 123,
        handleChange
    })
        .modifyUp(updater)
        .onChange(456);

    expect(handleChange.mock.calls[0][0].value).toBe(457);

    let [value, changeRequest] = updater.mock.calls[0];
    expect(value).toBe(456);
    expect(changeRequest instanceof ChangeRequest).toBe(true);
    expect(changeRequest.prevData.value).toBe(123);
    expect(changeRequest.nextData.value).toBe(456);
});

test('Parcel.modifyUp() should validate value updater', () => {
    let handleChange = () => {};

    TestValidateValueUpdater(
        expect,
        (value, updater) => new Parcel({
            value: undefined,
            handleChange
        })
            .modifyUp(updater)
            .onChange(value)
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
        .update(asShape(parcelShape => parcelShape
            .set(456)
            .setMeta({
                abc: 123
            })
        ));
});

test('Parcel.modifyUp() should cancel a change if CancelActionMarker is returned', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(() => CancelActionMarker);

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let parcelWithModifier = parcel.modifyUp(updater);
    parcelWithModifier.push(4);

    expect(handleChange).not.toHaveBeenCalled();
});

test('Parcel.modifyDown(parcelShapeUpdater) should be called with parcelShape and return with no change', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(parcelShape => parcelShape);

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let modifiedParcel = parcel.modifyDown(asShape(updater));
    modifiedParcel.push(4);

    expect(modifiedParcel.value).toEqual([1,2,3]);
    expect(updater.mock.calls[0][0] instanceof ParcelShape).toBe(true);
    expect(updater.mock.calls[0][0].data.value).toEqual([1,2,3]);
    expect(handleChange.mock.calls[0][0].data.value).toEqual([1,2,3,4]);

    expect(updater.mock.calls[0][1]).toBe(undefined);
});

test('Parcel.modifyDown(parcelShapeUpdater) should modify value', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(parcelShape => parcelShape.push(4));

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

     let modifiedParcel = parcel.modifyDown(asShape(updater));
    modifiedParcel.push(5);

    expect(modifiedParcel.value).toEqual([1,2,3,4]);
    expect(handleChange.mock.calls[0][0].data.value).toEqual([1,2,3,4,5]);

});

test('Parcel.modifyDown(parcelShapeUpdater) should work with a returned primitive', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(() => "!!!");

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let modifiedParcel = parcel.modifyDown(asShape(updater));
    modifiedParcel.set(456)

    expect(modifiedParcel.value).toEqual("!!!");
    expect(handleChange.mock.calls[0][0].data.value).toEqual(456);
});

test('Parcel.modifyDown(parcelShapeUpdater) should work with a returned undefined (unlike modifyUp(parcelShapeUpdater))', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(() => {});

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let modifiedParcel = parcel.modifyDown(asShape(updater));
    modifiedParcel.set(456)

    let expectedValue = undefined;

    expect(modifiedParcel.value).toEqual(expectedValue);
    expect(handleChange.mock.calls[0][0].data.value).toEqual(456);
});

test('Parcel.modifyDown(parcelShapeUpdater) should work with a returned collection containing parcels for children', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(parcelShape => parcelShape.children().reverse());

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let modifiedParcel = parcel.modifyDown(asShape(updater));
    modifiedParcel.push(4);

    let expectedValue = [3,2,1];

    expect(modifiedParcel.value).toEqual(expectedValue);
    expect(handleChange.mock.calls[0][0].data.value).toEqual([3,2,1,4]);
});

test('Parcel.modifyUp(parcelShapeUpdater) should be called with parcelShape and return with no change', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(parcelShape => parcelShape);

    let parcel = new Parcel({
        handleChange,
        value: 123
    });

    let parcelWithModifier = parcel.modifyUp(asShape(updater));
    let {value} = parcelWithModifier.data;

    expect(value).toEqual(123);
    expect(updater).not.toHaveBeenCalled();

    parcelWithModifier.set(456);

    let [parcelShape, changeRequest] = updater.mock.calls[0];

    expect(parcelShape instanceof ParcelShape).toBe(true);
    expect(parcelShape.data.value).toEqual(456);
    expect(changeRequest instanceof ChangeRequest).toBe(true);
    expect(changeRequest.prevData.value).toBe(123);
    expect(changeRequest.nextData.value).toBe(456);

    expect(handleChange.mock.calls[0][0].data.value).toEqual(456);
});

test('Parcel.modifyUp(parcelShapeUpdater) should modify value', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(parcelShape => parcelShape.push(5));

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let parcelWithModifier = parcel.modifyUp(asShape(updater));
    parcelWithModifier.push(4);

    expect(handleChange.mock.calls[0][0].data.value).toEqual([1,2,3,4,5]);
});

test('Parcel.modifyUp(parcelShapeUpdater) should work with a returned primitive', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(() => 123);

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let parcelWithModifier = parcel.modifyUp(asShape(updater));
    parcelWithModifier.push(4);

    expect(handleChange.mock.calls[0][0].data.value).toEqual(123);
});

test('Parcel.modifyUp(parcelShapeUpdater) should work with a returned collection containing parcels for children', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(parcelShape => parcelShape.children().reverse());

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let parcelWithModifier = parcel.modifyUp(asShape(updater));
    parcelWithModifier.push(4);

    expect(handleChange.mock.calls[0][0].data.value).toEqual([4,3,2,1]);
});

test('Parcel.modifyUp(parcelShapeUpdater) should cancel a change if CancelActionMarker is returned', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(() => CancelActionMarker);

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let parcelWithModifier = parcel.modifyUp(asShape(updater));
    parcelWithModifier.push(4);

    expect(handleChange).not.toHaveBeenCalled();
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
        .modifyDown(asShape(parcelShape => parcelShape.children().reverse())) // 1. reverse the elements in the parcel (value: [3,2,1])
        .modifyUp(asShape(parcelShape => parcelShape.children().reverse())) // 6. reverse the elements in the parcel (value: [3333,2,1])
        .get(0) // 2. get the first element (value: 3)
        .modifyDown(value => value + "") // 3. cast number to string value: "3")
        .modifyUp(value => parseInt(value, 10)) // 5. cast string to number (value will be: 3333)
        .update(updater); // 4. make a change to the data, append three threes (value will be: "3333")

    expect(updater.mock.calls[0][0]).toBe("3");
    expect(handleChange.mock.calls[0][0].value).toEqual([1,2,3333]);
});
