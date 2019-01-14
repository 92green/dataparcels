// @flow
import StaticParcel from '../StaticParcel';
import TestValidateValueUpdater from '../../util/__test__/TestValidateValueUpdater-testUtil';

test('StaticParcels set() should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            a: 1,
            b: 4
        },
        child: {
            a: {key: "a"},
            b: {key: "b"}
        }
    });

    let expectedData = {
        value: 456
    };

    expect(staticParcel.set(456).data).toEqual(expectedData);
});

test('StaticParcels setMeta(partialMeta) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: 123,
        meta: {
            abc: 123
        }
    });

    let expectedData = {
        value: 123,
        meta: {
            abc: 123,
            def: 456
        }
    };

    expect(staticParcel.setMeta({def: 456}).data).toEqual(expectedData);
});

test('StaticParcels setMeta(updater) should work', () => {
    let updater = jest.fn(meta => ({def: 456}));

    let staticParcel = StaticParcel.fromData({
        value: 123,
        meta: {
            abc: 123
        }
    });

    let expectedData = {
        value: 123,
        meta: {
            abc: 123,
            def: 456
        }
    };

    let {data} = staticParcel.setMeta(updater);

    expect(updater.mock.calls[0][0]).toEqual({
        abc: 123
    });

    expect(data).toEqual(expectedData);
});

test('StaticParcels update() should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: 123
    });

    let expectedData = {
        value: 124
    };

    expect(staticParcel.update(ii => ii + 1).data).toEqual(expectedData);
});

test('StaticParcels update() should validate value updater', () => {
    TestValidateValueUpdater(
        expect,
        (value, updater) => new StaticParcel(value).update(updater)
    );
});

test('StaticParcels updateShape() should work with returned StaticParcel', () => {
    let staticParcel = StaticParcel.fromData({
        value: 123,
        meta: {
            abc: 789
        },
        key: "z"
    });

    let expectedData = {
        value: 456,
        meta: {
            abc: 789
        },
        key: "z"
    };

    expect(staticParcel.updateShape(staticParcel => staticParcel.set(456)).data).toEqual(expectedData);
});

test('StaticParcels updateShape() should work with returned primitive', () => {
    let staticParcel = StaticParcel.fromData({
        value: 123,
        meta: {
            abc: 789
        },
        key: "z"
    });

    let expectedData = {
        value: 456,
        meta: {
            abc: 789
        },
        key: "z"
    };

    expect(staticParcel.updateShape(() => 456).data).toEqual(expectedData);
});

test('StaticParcels updateShape() should work with returned parent value', () => {
    let staticParcel = StaticParcel.fromData({
        value: [1,2,3],
        meta: {
            abc: 789
        },
        key: "z"
    });

    let expectedData = {
        value: [2,3,4],
        meta: {
            abc: 789
        },
        child: [
            {key: "#a", child: undefined},
            {key: "#b", child: undefined},
            {key: "#c", child: undefined}
        ],
        key: "z"
    };

    let {data} = staticParcel.updateShape((staticParcel) => {
        return staticParcel
            .children()
            .map((child => child.update(value => value + 1)))
    });

    expect(data).toEqual(expectedData);
});

test('StaticParcels updateShape() should work with returned parent value of different type', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            abc: 123,
            def: 456
        },
        meta: {
            abc: 789
        },
        key: "z"
    });

    let expectedData = {
        value: [
            123,
            456
        ],
        meta: {
            abc: 789
        },
        child: [
            {key: "#a", child: undefined},
            {key: "#b", child: undefined}
        ],
        key: "z"
    };

    let {data} = staticParcel.updateShape((staticParcel) => staticParcel.toArray());

    expect(data).toEqual(expectedData);
});

test('StaticParcels updateShape() should retain childs keys', () => {
    let staticParcel = StaticParcel.fromData({
        value: ["a","b","c","d"],
        child: [
            {key: "#a", child: undefined},
            {key: "#b", child: undefined, meta: {abc: 123}},
            {key: "#c", child: undefined},
            {key: "#d", child: undefined}
        ]
    });

    let expectedData = {
        value: ["b","d"],
        child: [
            {key: "#b", child: undefined, meta: {abc: 123}},
            {key: "#d", child: undefined}
        ]
    };

    let {data} = staticParcel.updateShape((staticParcel) => {
        return staticParcel
            .toArray()
            .filter((value, key) => key % 2 === 1)
    });

    expect(data).toEqual(expectedData);
});

test('StaticParcels updateShape() should throw error if non staticparcel is a child of the return value', () => {
    let staticParcel = StaticParcel.fromData({
        value: [123, 456]
    });

    expect(() => staticParcel.updateShape((staticParcel) => {
        let arr = staticParcel.toArray();
        arr.push(789);
        return arr;
    })).toThrow('Every child value on a collection returned from a shape updater must be a StaticParcel');
});
