// @flow
import ParcelShape from '../ParcelShape';
import updateShape from '../updateShape';
import TestValidateValueUpdater from '../../util/__test__/TestValidateValueUpdater-testUtil';

test('ParcelShapes set() should work', () => {
    let parcelShape = ParcelShape.fromData({
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

    expect(parcelShape.set(456).data).toEqual(expectedData);
});

test('ParcelShapes setMeta(partialMeta) should work', () => {
    let parcelShape = ParcelShape.fromData({
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

    expect(parcelShape.setMeta({def: 456}).data).toEqual(expectedData);
});

test('ParcelShapes setMeta(updater) should work', () => {
    let updater = jest.fn(meta => ({def: 456}));

    let parcelShape = ParcelShape.fromData({
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

    let {data} = parcelShape.setMeta(updater);

    expect(updater.mock.calls[0][0]).toEqual({
        abc: 123
    });

    expect(data).toEqual(expectedData);
});

test('ParcelShapes update() should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: 123
    });

    let expectedData = {
        value: 124
    };

    expect(parcelShape.update(ii => ii + 1).data).toEqual(expectedData);
});

test('ParcelShapes update() should validate value updater', () => {
    TestValidateValueUpdater(
        expect,
        (value, updater) => new ParcelShape(value).update(updater)
    );
});

test('ParcelShapes update(updateShape()) should work', () => {
    let parcelShape = ParcelShape.fromData({
        value: {
            abc: 123
        }
    });

    let expectedValue = {
        abc: 123,
        def: 456
    };

    expect(parcelShape.update(updateShape(parcelShape => parcelShape.set('def', 456))).value).toEqual(expectedValue);
});


test('ParcelShapes _updateShape() should work with returned ParcelShape', () => {
    let parcelShape = ParcelShape.fromData({
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

    expect(parcelShape._updateShape(parcelShape => parcelShape.set(456)).data).toEqual(expectedData);
});

test('ParcelShapes _updateShape() should work with returned primitive', () => {
    let parcelShape = ParcelShape.fromData({
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

    expect(parcelShape._updateShape(() => 456).data).toEqual(expectedData);
});

test('ParcelShapes _updateShape() should work with returned parent value', () => {
    let parcelShape = ParcelShape.fromData({
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

    let {data} = parcelShape._updateShape((parcelShape) => {
        return parcelShape
            .children()
            .map((child => child.update(value => value + 1)))
    });

    expect(data).toEqual(expectedData);
});

test('ParcelShapes _updateShape() should work with returned parent value of different type', () => {
    let parcelShape = ParcelShape.fromData({
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

    let {data} = parcelShape._updateShape((parcelShape) => parcelShape.toArray());

    expect(data).toEqual(expectedData);
});

test('ParcelShapes _updateShape() should retain childs keys', () => {
    let parcelShape = ParcelShape.fromData({
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

    let {data} = parcelShape._updateShape((parcelShape) => {
        return parcelShape
            .toArray()
            .filter((value, key) => key % 2 === 1)
    });

    expect(data).toEqual(expectedData);
});

test('ParcelShapes _updateShape() should throw error if non ParcelShape is a child of the return value', () => {
    let parcelShape = ParcelShape.fromData({
        value: [123, 456]
    });

    expect(() => parcelShape._updateShape((parcelShape) => {
        let arr = parcelShape.toArray();
        arr.push(789);
        return arr;
    })).toThrow('Every child value on a collection returned from a shape updater must be a ParcelShape');
});
