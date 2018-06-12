// @flow
import test from 'ava';
import Parcel from '../Parcel';
import type ChangeRequest from '../../change/ChangeRequest';

test('Parcel.modify() should return the result of modifys updaters', (tt: Object) => {
    var data = {
        value: 123,
    };

    let parcel = new Parcel(data);
    let modifiedParcel = null;

    let modified = parcel.modify(
        ii => {
            tt.is(ii, parcel, 'modify is passed parcel (1st modifier)');
            modifiedParcel = ii.modifyValue(ii => ii + 100);
            return modifiedParcel;
        },
        ii => {
            tt.is(ii, modifiedParcel, 'modify is passed parcel from 1st modifier (2nd modifier)');
            modifiedParcel = ii.modifyValue(ii => ii + 100);
            return modifiedParcel;
        }
    );

    tt.is(modifiedParcel, modified, 'modify returns modified parcel');
    tt.is(323, modifiedParcel && modifiedParcel.value(), 'modify returns modified parcel value');
});


test('Parcel.modifyData() should return a new parcel with updated parcelData', (tt: Object) => {
    var data = {
        value: 123,
        key: "#a"
    };
    var updated = new Parcel(data)
        .modifyData((parcelData) => ({
            value: "???"
        }))
        .data();

    var expectedData = {
        value: "???",
        key: "^"
    };
    tt.deepEqual(expectedData, updated);
});

test('Parcel.modifyValue() should return a new parcel with updated parcelData', (tt: Object) => {
    tt.plan(2);
    var data = {
        value: [123]
    };
    var parcel = new Parcel(data).get(0);
    var updated = parcel
        .modifyValue((value: *, parcelData: Parcel) => {
            tt.is(parcelData, parcel, "modifyValue is passed the Parcel as the second argument");
            return value + 1;
        })
        .data();

    var expectedData = {
        value: 124,
        key: "#a"
    };
    tt.deepEqual(expectedData, updated);
});

test('Parcel.modifyChange() should allow you to change the payload of a changed parcel', (tt: Object) => {
    tt.plan(1);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value} = parcel.data();
            tt.is(457, value, "original handleChange should receive updated value");
        }
    };

    new Parcel(data)
        .modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {
            parcel.setSelf(changeRequest.data().value + 1);
        })
        .onChange(456);
});

test('Parcel.modifyChange() should allow you to stop a change by not calling dispatch', (tt: Object) => {
    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            tt.fail('modifyChange() with no changes in it should NOT call handle change, but it has');
        }
    };

    new Parcel(data)
        .modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {
            // nothing here, run a passing assertion to make this test valid
            tt.true(true);
        })
        .onChange(456);
});

test('Parcel.modifyChangeValue() should allow you to change the payload of a changed parcel with an updater', (tt: Object) => {
    tt.plan(1);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value} = parcel.data();
            tt.is(457, value, "original handleChange should receive updated value");
        }
    };

    new Parcel(data)
        .modifyChangeValue(value => value + 1)
        .onChange(456);
});

test('Parcel.modifyChangeValue() should allow changes to meta through', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value, meta} = parcel.data();
            tt.is(457, value, "original handleChange should receive updated value");
            tt.deepEqual({abc: 123}, meta, "original handleChange should receive updated meta");
        }
    };

    new Parcel(data)
        .modifyChangeValue(value => value + 1)
        .batch(parcel => {
            parcel.onChange(456);
            parcel.setMeta({
                abc: 123
            });
        });
});


test('Parcel.initialMeta() should work', (tt: Object) => {
    tt.plan(3);

    let meta = {a:1, b:2};

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {meta} = parcel.data();
            tt.deepEqual({a:1, b:3}, meta, `meta changes in actions take precedence over initial meta`);
            tt.deepEqual({a:1, b:3}, parcel.initialMeta().meta(), `applying initial meta a second time has no effect`);
        }
    };

    let parcel = new Parcel(data).initialMeta(meta);
    tt.deepEqual(meta, parcel.meta(), `initialMeta should be applied to returned parcel`);
    parcel.setMeta({
        b: 3
    });
});

test('Parcel.initialMeta() should merge', (tt: Object) => {
    tt.plan(2);

    let meta = {a:1, b:2};
    let meta2 = {b:1, c:3}; // this b will be ignored because it will have already been set by the time this is applied

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {meta} = parcel.data();
            tt.deepEqual({a:1, b:3, c:3}, meta, `meta changes in actions take precedence over initial meta`);
        }
    };

    let parcel = new Parcel(data).initialMeta(meta).initialMeta(meta2);
    tt.deepEqual({a:1, b:2, c:3}, parcel.meta(), `initialMeta should be applied to returned parcel`);
    parcel.setMeta({
        b: 3
    });
});

test('Parcel should addModifier', (tt: Object) => {
    var data = {
        value: [1,2,3]
    };

    let parcel = new Parcel(data)
        .addModifier((parcel) => parcel.modifyValue(ii => Array.isArray(ii) ? [...ii, 4] : ii + 10));

    tt.deepEqual([1,2,3,4], parcel.value(), "parcel value proves that modifier has been applied to current parcel");

    let element = parcel.get(0);
    tt.deepEqual(11, element.value(), "element parcel value proves that modifier has been applied to current parcel");
});

test('Parcel should addDescendantModifier', (tt: Object) => {
    var data = {
        value: [1,2,3]
    };

    let parcel = new Parcel(data)
        .addDescendantModifier((parcel) => parcel.modifyValue(ii => Array.isArray(ii) ? [...ii, 4] : ii + 10));

    tt.deepEqual([1,2,3], parcel.value(), "parcel value proves that modifier has NOT been applied to current parcel");

    let element = parcel.get(0);
    tt.deepEqual( 11,element.value(), "element parcel value proves that modifier has been applied to current parcel");
});

test('Parcel should addModifier with simple match', (tt: Object) => {
    var data = {
        value: {
            abc: 123,
            def: 456
        }
    };

    let parcel = new Parcel(data)
        .addModifier({
            modifier: (parcel) => parcel.modifyValue(ii => ii + 1),
            match: "abc"
        });

    tt.is(124, parcel.get('abc').value(), "abc parcel value proves that modifier has been applied");
    tt.is(456, parcel.get('def').value(), "def parcel value proves that modifier has NOT been applied");
});

test('Parcel should addModifier with deep match', (tt: Object) => {
    var data = {
        value: {
            abc: {
                ghi: 123
            },
            def: 456
        }
    };

    let parcel = new Parcel(data)
        .addModifier({
            modifier: (parcel) => parcel.modifyValue(ii => ii + 1),
            match: "abc.ghi"
        });

    tt.is(124, parcel.getIn(['abc', 'ghi']).value(), "abc.ghi parcel value proves that modifier has been applied");
    tt.is(456, parcel.get('def').value(), "def parcel value proves that modifier has NOT been applied");
});

test('Parcel should addModifier with globstar', (tt: Object) => {
    var data = {
        value: {
            abc: {
                ghi: 123
            },
            def: 456
        }
    };

    let parcel = new Parcel(data)
        .addModifier({
            modifier: (parcel) => parcel.modifyValue(ii => typeof ii === "number" ?  ii + 1 : {...ii, woo: true}),
            match: "**.*"
        });

    tt.is(124, parcel.getIn(['abc', 'ghi']).value(), "abc.ghi parcel value proves that modifier has been applied");
    tt.is(457, parcel.get('def').value(), "def parcel value proves that modifier has been applied");
});

test('Parcel should addModifier with typed match', (tt: Object) => {
    var data = {
        value: {
            abc: {
                ghi: [1,2,3],
                jkl: 123
            },
            def: 456,
            mno: [4,5,6]
        }
    };

    let parcel = new Parcel(data)
        .addModifier({
            modifier: (parcel) => parcel.modifyValue(ii => [...ii, 999]),
            match: "**.*:Indexed"
        });

    tt.deepEqual([4,5,6,999], parcel.get('mno').value(), "mno parcel value proves that modifier has been applied");
});

test('Parcel should addPreModifier', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123,
        handleChange: (parcel) => {
            tt.is(457, parcel.value(), "handleChange parcel value proves that modifier has been applied");
        }
    };

    let parcel = new Parcel(data)
        .addPreModifier((parcel) => parcel.modifyValue(ii => ii + 1));

    tt.is(124, parcel.value(), "constructed parcel value proves that modifier has been applied");
    parcel.onChange(456);
});
