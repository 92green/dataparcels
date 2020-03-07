// @flow
// import update from 'unmutable/lib/update';

import ChangeRequest from '../../change/ChangeRequest';
import Parcel from '../Parcel';
import cancel from '../../change/cancel';
import asNode from '../../parcelNode/asNode';
import asChildNodes from '../../parcelNode/asChildNodes';

test('Parcel.modifyDown() should return a new parcel with updated parcelData', () => {
    let updater = jest.fn(({value}) => ({
        value: value + 1
    }));

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
    expect(updated).toEqual(expectedData);
    expect(updater.mock.calls[0][0]).toEqual(parcel.data);
});

test('Parcel.modifyDown() should merge meta', () => {
    let handleChange = jest.fn();
    let updater = jest.fn(({value}) => ({
        value: value + 1
    }));

    var parcel = new Parcel({
        value: 123,
        handleChange
    })
        .setMeta({abc: 100, def: 200});

    let newParcel = handleChange.mock.calls[0][0].modifyDown(({meta}) => {
        return {
            meta: {
                def: 400,
                ghi: 300
            }
        };
    });

    expect(newParcel.meta).toEqual({
        abc: 100,
        def: 400,
        ghi: 300
    });
});

test('Parcel.modifyDown() should not destroy child data', () => {
    let handleChange = jest.fn();
    let updater = jest.fn(({value}) => ({
        value: value + 1
    }));

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

test('Parcel.modifyDown() should allow undefined to be returned', () => {
    let parcel = new Parcel({value: 123});
    expect(parcel.modifyDown(() => {}).data).toEqual(parcel.data);
});

test('Parcel.modifyDown() should recognise if value changes types, and set value if type changes', () => {
    let handleChange = jest.fn();
    let parcel = new Parcel({
        value: 123,
        handleChange
    })
        .modifyDown(({value}) => ({value: []}))
        .push(123);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value).toEqual([123]);
});

test('Parcel.modifyDown() should have id which is unique to updater', () => {
    let updater = () => ({value: []});
    let updater2 = ({value}) => ({value: 123});

    let sameA1 = new Parcel().modifyDown(updater);
    let sameA2 = new Parcel().modifyDown(updater);
    let differentA = new Parcel().modifyDown(updater2);

    let sameB1 = new Parcel().modifyDown(asChildNodes(updater));
    let sameB2 = new Parcel().modifyDown(asChildNodes(updater));
    let differentB = new Parcel().modifyDown(asChildNodes(a => 1 + 2));

    expect(sameA1.id).toBe(sameA2.id);
    expect(sameA1.id).not.toBe(differentA.id);
    expect(sameB1.id).toBe(sameB2.id);
    expect(sameB1.id).not.toBe(differentB.id);
});

test('Parcel.modifyUp() should have id which is unique to updater', () => {
    let updater = () => ({value: []});
    let updater2 = ({value}) => ({value: 123});

    let sameA1 = new Parcel().modifyUp(updater);
    let sameA2 = new Parcel().modifyUp(updater);
    let differentA = new Parcel().modifyUp(updater2);

    let sameB1 = new Parcel().modifyUp(asChildNodes(updater));
    let sameB2 = new Parcel().modifyUp(asChildNodes(updater));
    let differentB = new Parcel().modifyUp(asChildNodes(a => 1 + 2));

    expect(sameA1.id).toBe(sameA2.id);
    expect(sameA1.id).not.toBe(differentA.id);
    expect(sameB1.id).toBe(sameB2.id);
    expect(sameB1.id).not.toBe(differentB.id);
});

test('Parcel.modifyUp() should allow you to change the payload of a changed parcel with an updater (and should allow non-parent types to be returned)', () => {
    let handleChange = jest.fn();
    let updater = jest.fn(({value}) => ({value: value + 1}));

    new Parcel({
        value: 123,
        handleChange
    })
        .modifyUp(updater)
        .set(456);

    expect(handleChange.mock.calls[0][0].value).toBe(457);

    let {value, changeRequest} = updater.mock.calls[0][0];
    expect(value).toBe(456);
    expect(changeRequest instanceof ChangeRequest).toBe(true);
    expect(changeRequest.prevData.value).toBe(123);
    expect(changeRequest.nextData.value).toBe(456);
});

test('Parcel.modifyUp() should allow changes to meta through', () => {
    expect.assertions(1);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value, meta} = parcel.data;
            expect({abc: 123}).toEqual(meta);
        }
    };

    new Parcel(data)
        .modifyUp(({value}) => ({value: value + 1}))
        .update(asNode(node => node.setMeta({
            abc: 123
        })));
});

test('Parcel.modifyUp() should cancel a change if cancel is returned', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(() => cancel);

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let parcelWithModifier = parcel.modifyUp(updater);
    parcelWithModifier.push(4);

    expect(handleChange).not.toHaveBeenCalled();
});

test('Parcel.modifyUp() should cancel a change if a value of cancel is returned', () => {

    let handleChange = jest.fn();
    let updater = jest.fn(() => ({
        value: cancel
    }));

    let parcel = new Parcel({
        handleChange,
        value: [1,2,3]
    });

    let parcelWithModifier = parcel.modifyUp(updater);
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
