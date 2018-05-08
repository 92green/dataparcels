// @flow
import test from 'ava';
import Parcel from '../Parcel';

const handleChange = ii => {};

test('Parcel.data() should return the Parcels data', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };

    var expectedData = {
        key: '^',
        value: 123
    };

    tt.deepEqual(expectedData, new Parcel(data).data());
});

test('Parcel.data() should strip the returned Parcel data', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };

    var expectedData = {
        key: '^',
        value: 123
    };

    tt.deepEqual(new Parcel(data).data(), expectedData);
});

test('Parcel.raw() should return the Parcels data without stripping', (tt: Object) => {
    var data = {
        value: 123,
        child: undefined,
        handleChange
    };

    var expectedData = {
        value: 123,
        child: undefined,
        key: '^',
        meta: {}
    };

    tt.deepEqual(expectedData, new Parcel(data).raw());
});

test('Parcel.value() should return the Parcels value', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };
    tt.is(new Parcel(data).value(), 123);
});

test('Parcel.value() should return the same instance of the Parcels value', (tt: Object) => {
    var myObject = {a:1,b:2};
    var data = {
        value: myObject,
        handleChange
    };
    tt.is(new Parcel(data).value(), myObject);
});


test('Parcels should be able to accept no config', (tt: Object) => {
    let parcel = new Parcel();
    tt.deepEqual(undefined, parcel.value());
    parcel.onChange(123);
});

test('Parcels should be able to accept just value in config', (tt: Object) => {
    let parcel = new Parcel({
        value: 123
    });
    tt.deepEqual(123, parcel.value());
    parcel.onChange(456);
});

test('Parcels should be able to accept just handleChange in config', (tt: Object) => {
    let parcel = new Parcel({
        handleChange: (parcel) => {
            tt.is(456, parcel.value());
        }
    });
    tt.deepEqual(undefined, parcel.value());
    parcel.onChange(456);
});

test('Parcel.setSelf() should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).setSelf(456);
});

test('Parcel.updateSelf() should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(3);

    var data = {
        value: 123
    };

    var expectedArg = 123;

    var expectedData = {
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).updateSelf((ii) => {
        tt.deepEqual(expectedArg, ii, 'update passes correct argument to updater');
        return 456;
    });
});

test('Parcel.onChange() should work like set that only accepts a single argument', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).onChange(456);
});

test('Parcel.onChangeDOM() should work like onChange but take the value from event.target.value', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 456,
        key: '^'
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).onChangeDOM({
        target: {
            value: 456
        }
    });
});

test('Parcel.spread() returns an object with value and onChange', (tt: Object) => {
    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.is(value, 456);
        }
    };

    var parcel = new Parcel(data);

    const {
        value,
        onChange
    } = parcel.spread();

    tt.is(value, parcel.value(), 'value is returned');
    tt.is(onChange, parcel.onChange, 'onChange is returned');
});

test('Parcel.spreadDOM() returns an object with value and onChange (onChangeDOM)', (tt: Object) => {
    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.is(value, 456);
        }
    };

    var parcel = new Parcel(data);

    const {
        value,
        onChange
    } = parcel.spreadDOM();

    tt.is(value, parcel.value(), 'value is returned');
    tt.is(onChange, parcel.onChangeDOM, 'onChangeDOM is returned');
});

test('Parcel.setMeta() should call the Parcels handleChange function with the new meta merged in', (tt: Object) => {
    tt.plan(3);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 123,
        key: '^',
        meta: {
            abc: 123
        }
    };

    var expectedData2 = {
        value: 123,
        key: '^',
        meta: {
            abc: 123,
            def: 456
        }
    };

    var expectedAction = {
        type: "setMeta",
        keyPath: [],
        payload: {
            meta: {
                abc: 123
            }
        }
    };

    var changes = 0;

    new Parcel({
        ...data,
        handleChange: (parcel, action) => {
            changes++;

            if(changes === 1) {
                tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
                tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
                parcel.setMeta({
                    def: 456
                });

            } else if(changes === 2) {
                tt.deepEqual(expectedData2, parcel.data(), 'updated data is correct');
            }
        }
    }).setMeta({
        abc: 123
    });
});

test('Parcel.meta() should return meta', (tt: Object) => {
    var meta = {
        abc: 123,
        def: 456
    };

    var data = {
        value: 123,
        handleChange: (parcel) => {
            // the see if it is returned correctly
            tt.deepEqual(meta, parcel.meta(), 'meta is returned');
            tt.true(meta !== parcel.meta(), 'meta object should be cloned to prevent mutating');
        }
    };

    // first set the meta
    var parcel = new Parcel(data).setMeta(meta);
});

test('Parcel.meta(key) should return meta', (tt: Object) => {
    var meta = {
        abc: 123,
        def: 456
    };

    var data = {
        value: 123,
        handleChange: (parcel) => {
            // the see if it is returned correctly
            tt.deepEqual(meta.abc, parcel.meta('abc'), 'meta is returned');
        }
    };

    // first set the meta
    var parcel = new Parcel(data).setMeta(meta);
});


test('Parcel.updateMeta() should call the Parcels handleChange function with the new meta merged in', (tt: Object) => {
    tt.plan(5);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 123,
        key: '^',
        meta: {
            abc: 123
        }
    };

    var expectedData2 = {
        value: 123,
        key: '^',
        meta: {
            abc: 123,
            def: 456
        }
    };

    var expectedAction = {
        type: "setMeta",
        keyPath: [],
        payload: {
            meta: {
                abc: 123
            }
        }
    };

    var changes = 0;

    new Parcel({
        ...data,
        handleChange: (parcel, action) => {
            changes++;

            if(changes === 1) {
                tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
                tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
                parcel.updateMeta(meta => {
                    tt.deepEqual({abc: 123}, meta, 'updateMeta should receive initial meta of {abc:123}')
                    return {
                        def: 456
                    };
                });

            } else if(changes === 2) {
                tt.deepEqual(expectedData2, parcel.data(), 'updated data is correct');
            }
        }
    }).updateMeta(meta => {
        tt.deepEqual({}, meta, 'updateMeta should receive initial meta of {}')
        return {
            abc: 123
        };
    });
});

test('Parcel should refresh()', (tt: Object) => {
    var data = {
        value: {
            z: {
                a: 123,
                b: [1,2,3],
                c: "!"
            },
            y: "Y!"
        },
        handleChange: (parcel, actions) => {
            // once actions have dispatcher ids, check to see if they are the right ones in the right order
            console.log(actions);
        }
    };

    let z = new Parcel(data).get('z');
    z.get('c');
    z.get('b').modifyChange(({continueChange, parcel, newParcelData}) => {
        parcel.setMeta({a:1});
        continueChange();
    }).get(0);
    z.refresh();
});
