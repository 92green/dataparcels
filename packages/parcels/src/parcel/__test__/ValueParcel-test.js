// @flow
import test from 'ava';
import Parcel from '../../ParcelFactory';

const handleChange = ii => {};

test('ValueParcel.data() should return the Parcels data', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };

    var expectedData = {
        value: 123
    };

    tt.deepEqual(expectedData, Parcel(data).data());
});

test('ValueParcel.data() should strip the returned Parcel data', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };

    var expectedData = {
        value: 123
    };

    tt.deepEqual(Parcel(data).data(), expectedData);
});

test('ValueParcel.raw() should return the Parcels data without stripping', (tt: Object) => {
    var data = {
        value: 123,
        child: undefined,
        handleChange
    };

    var expectedData = {
        value: 123,
        child: undefined,
        key: undefined
    };

    tt.deepEqual(expectedData, Parcel(data).raw());
});

test('ValueParcel.value() should return the Parcels value', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };
    tt.is(Parcel(data).value(), 123);
});

test('ValueParcel.value() should return the same instance of the Parcels value', (tt: Object) => {
    var myObject = {a:1,b:2};
    var data = {
        value: myObject,
        handleChange
    };
    tt.is(Parcel(data).value(), myObject);
});

test('ValueParcel.set() should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 456
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).set(456);
});

test('ValueParcel.update() should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(3);

    var data = {
        value: 123
    };

    var expectedArg = 123;

    var expectedData = {
        value: 456
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).update((ii) => {
        tt.deepEqual(expectedArg, ii, 'update passes correct argument to updater');
        return 456;
    });
});

test('ValueParcel.onChange() should work like set that only accepts a single argument', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 456
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).onChange(456);
});

test('ValueParcel.onChangeDOM() should work like onChange but take the value from event.target.value', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: 123
    };

    var expectedData = {
        value: 456
    };

    var expectedAction = {
        type: "set",
        keyPath: [],
        payload: {
            value: 456
        }
    };

    Parcel({
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

test('ValueParcel.spread() returns an object with value and onChange', (tt: Object) => {
    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.is(value, 456);
        }
    };

    var parcel = Parcel(data);

    const {
        value,
        onChange
    } = parcel.spread();

    tt.is(value, parcel.value(), 'value is returned');
    tt.is(onChange, parcel.onChange, 'onChange is returned');
});

test('ValueParcel.spreadDOM() returns an object with value and onChange (onChangeDOM)', (tt: Object) => {
    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.is(value, 456);
        }
    };

    var parcel = Parcel(data);

    const {
        value,
        onChange
    } = parcel.spreadDOM();

    tt.is(value, parcel.value(), 'value is returned');
    tt.is(onChange, parcel.onChangeDOM, 'onChangeDOM is returned');
});

// test('ValueParcel.metaChange() should call the Parcels handleChange function with the existing parcelData value and new meta', (tt: Object) => {
//     tt.plan(2);

//     var data = {
//         value: 123,
//         meta: {
//             a: 1
//         },
//         handleChange: (parcel) => {
//             let {value, meta} = parcel.data();
//             tt.is(value, 123);
//             tt.deepEqual(meta, {b: 4});
//         }
//     };

//     Parcel(data).metaChange()({b: 4});
// });

// test('ValueParcel.metaChange(key) should call the Parcels handleChange function with the existing parcelData value and an existing meta key', (tt: Object) => {
//     tt.plan(2);

//     var data = {
//         value: 123,
//         meta: {
//             a: 1,
//             b: 2
//         },
//         handleChange: (parcel) => {
//             let {value, meta} = parcel.data();
//             tt.is(value, 123);
//             tt.deepEqual(meta, {a: 1, b: 4});
//         }
//     };

//     Parcel(data).metaChange('b')(4);
// });

// test('ValueParcel.metaChange(key) should call the Parcels handleChange function with the existing parcelData value and a new meta key', (tt: Object) => {
//     tt.plan(2);

//     var data = {
//         value: 123,
//         meta: {
//             a: 1
//         },
//         handleChange: (parcel) => {
//             let {value, meta} = parcel.data();
//             tt.is(value, 123);
//             tt.deepEqual(meta, {a: 1, newish: "!!!"});
//         }
//     };

//     Parcel(data).metaChange('newish')("!!!");
// });

test('ValueParcel.key() should return the Parcels key', (tt: Object) => {
    var data = {
        value: 123,
        key: "#a",
        handleChange
    };
    tt.is(Parcel(data).key(), "#a");
});

test('ValueParcel.id() should return the Parcels id', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3]
        },
        handleChange
    };
    tt.is(Parcel(data).id(), "_");
    tt.is(Parcel(data).get("a").id(), "_.a");
    tt.is(Parcel(data).getIn(["a",0]).id(), "_.a.#a");
    tt.is(Parcel(data).get("a").modifyValue(ii => ii).get(1).id(), "_.a.&uv&.#b");
});

test('ValueParcel.pathId() should return the Parcels path id', (tt: Object) => {
    var data = {
        value: {
            a: [1,2,3]
        },
        handleChange
    };
    tt.is(Parcel(data).pathId(), "_");
    tt.is(Parcel(data).get("a").pathId(), "_.a");
    tt.is(Parcel(data).getIn(["a",0]).pathId(), "_.a.#a");
    tt.is(Parcel(data).get("a").modifyValue(ii => ii).get(1).pathId(), "_.a.#b");
});

test('ValueParcel.chain() should return the result of chains updater', (tt: Object) => {
    var data = {
        value: 123,
        handleChange
    };

    let parcel = Parcel(data);
    let modifiedParcel = null;

    let chained = parcel.chain(ii => {
        tt.is(ii, parcel, 'chain is passed parcel');
        modifiedParcel = ii.modifyValue(ii => ii + 100);
        return modifiedParcel;
    });

    tt.is(modifiedParcel, chained, 'chain returns modified parcel');
    tt.is(223, modifiedParcel.value(), 'chain returns modified parcel value');
});

test('ValueParcel.modify() should return a new parcel with updated parcelData', (tt: Object) => {
    var data = {
        value: 123,
        key: "#a",
        handleChange
    };
    var updated = Parcel(data)
        .modify((parcelData) => ({
            value: "???"
        }))
        .data();

    var expectedData = {
        value: "???"
    };
    tt.deepEqual(expectedData, updated);
});

test('ValueParcel.modifyValue() should return a new parcel with updated parcelData', (tt: Object) => {
    tt.plan(2);
    var data = {
        value: 123,
        key: "#a",
        handleChange
    };
    var parcel = Parcel(data);
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

// test('ValueParcel.modifyMeta(updater) should return a new parcel with updated parcelData', (tt: Object) => {
//     tt.plan(2);
//     var data = {
//         value: 123,
//         meta: {
//             things: 456,
//             thongs: 12
//         },
//         key: "#a",
//         handleChange
//     };
//     var parcel = Parcel(data);
//     var updated = parcel
//         .modifyMeta((meta: Object, parcelData: Parcel): * => {
//             tt.is(parcelData, parcel, "modifyValue is passed the Parcel as the second argument");
//             return {
//                 things: meta.things + meta.thongs
//             };
//         })
//         .raw();

//     var expectedData = {
//         value: 123,
//         meta: {
//             things: 468
//         },
//         key: "#a",
//         child: undefined
//     };
//     tt.deepEqual(updated, expectedData);
// });

// test('ValueParcel.modifyMeta(key, updater) should return a new parcel with updated parcelData', (tt: Object) => {
//     var data = {
//         value: 123,
//         meta: {
//             things: 456,
//             thongs: 12
//         },
//         key: "#a",
//         handleChange
//     };
//     var parcel = Parcel(data);
//     var updated = parcel
//         .modifyMeta('thongs', (meta: *, parcelData: Parcel): * => {
//             tt.is(parcelData, parcel, "modifyValue is passed the Parcel as the second argument");
//             return -meta;
//         })
//         .raw();

//     var expectedData = {
//         value: 123,
//         meta: {
//             things: 456,
//             thongs: -12
//         },
//         key: "#a",
//         child: undefined
//     };
//     tt.deepEqual(updated, expectedData);
// });

test('ValueParcel._buffer() should buffer any actions and _flush() should dispatch them', (tt: Object) => {
    tt.plan(4);

    var functionCalls = [];
    var expectedFunctionCalls = [
        '_buffer',
        'onChange(456)',
        'onChange(789)',
        'handleChange'
    ];

    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.is(value, 789);
            functionCalls.push("handleChange");
        }
    };

    let parcel = Parcel(data);
    parcel._buffer();
    functionCalls.push("_buffer");
    parcel.onChange(456);
    tt.deepEqual({value: 456}, parcel.data(), 'parcel contains correct data after first onchange');
    functionCalls.push("onChange(456)");
    parcel.onChange(789);
    tt.deepEqual({value: 789}, parcel.data(), 'parcel contains correct data after second onchange');
    functionCalls.push("onChange(789)");
    parcel._flush();

    tt.deepEqual(expectedFunctionCalls, functionCalls, 'functions are called in correct order due to buffering');
});

test('ValueParcel.batch() should batch actions', (tt: Object) => {
    tt.plan(2);

    var functionCalls = [];
    var expectedFunctionCalls = [
        'batch',
        'onChange(456)',
        'onChange(789)',
        'handleChange'
    ];

    var data = {
        value: 123,
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.is(value, 789);
            functionCalls.push("handleChange");
        }
    };

    Parcel(data).batch((parcel) => {
        functionCalls.push("batch");
        parcel.onChange(456);
        functionCalls.push("onChange(456)");
        parcel.onChange(789);
        functionCalls.push("onChange(789)");
    });

    tt.deepEqual(expectedFunctionCalls, functionCalls, 'functions are called in correct order due to buffering');
});

test('ValueParcel.modifyChange() should allow you to change the payload of a changed parcel', (tt: Object) => {
    tt.plan(1);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value} = parcel.data();
            tt.is(value, 457, "original handleChange should receive updated value");
        }
    };

    Parcel(data)
        .modifyChange(({parcel, newParcelData}: Object): Object => {
            parcel.set(newParcelData.value + 1);
        })
        .onChange(456);
});

test('ValueParcel.modifyChange() should allow you to call apply to continue without modification', (tt: Object) => {
    tt.plan(1);

    var data = {
        value: 123,
        handleChange: (parcel: Parcel) => {
            let {value} = parcel.data();
            tt.is(value, 456, "original handleChange should receive updated value");
        }
    };

    Parcel(data)
        .modifyChange(({apply}) => apply())
        .onChange(456);
});
