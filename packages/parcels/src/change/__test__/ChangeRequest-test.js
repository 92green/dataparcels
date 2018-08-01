// @flow
import test from 'ava';
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import Parcel from '../../parcel/Parcel';

test('ChangeRequest should build an action', t => {
    let expectedDefaultData = {
        actions: [],
        meta: {},
        originId: null,
        originPath: null,
    };
    t.deepEqual(expectedDefaultData, new ChangeRequest().toJS());
});

test('ChangeRequest actions() should get actions', t => {
    let actions = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    t.deepEqual(actions, new ChangeRequest(actions).actions());
});

test('ChangeRequest updateActions() should update actions', t => {
    let actions = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    t.deepEqual([actions[0]], new ChangeRequest(actions)
        .updateActions(actions => actions.filter(aa => aa.type === "???"))
        .actions()
    );
});

test('ChangeRequest merge() should merge other change requests actions', t => {
    let actionsA = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    let actionsB = [
        new Action({type: "aaa", keyPath: ['b']}),
        new Action({type: "bbb", keyPath: ['b']})
    ];

    let a = new ChangeRequest(actionsA);
    let b = new ChangeRequest(actionsB);

    let merged = a.merge(b);

    t.deepEqual(
        [...actionsA, ...actionsB],
        merged.actions()
    );

    // TODO - test originId, originPath and meta
});


test('ChangeRequest setChangeRequestMeta() and changeRequestMeta() should work', t => {
    let expectedMeta = {
        a: 3,
        b: 2
    };
    t.deepEqual(
        expectedMeta,
        new ChangeRequest()
            .setChangeRequestMeta({a: 1})
            .setChangeRequestMeta({b: 2})
            .setChangeRequestMeta({a: 3})
            .changeRequestMeta()
    );
});

test('ChangeRequest _unget() should prepend key', t => {
    let actions = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    let expectedKeyPaths = [
        ['b', 'a'],
        ['b', 'a']
    ];

    t.deepEqual(
        expectedKeyPaths,
        new ChangeRequest(actions)
            ._unget('b')
            .actions()
            .map(aa => aa.keyPath)
    );
});

test('ChangeRequest setBaseParcel() and data() should use Reducer', t => {
    var action = new Action({
        type: "set",
        keyPath: ["b"],
        payload: {
            value: 3
        }
    });

    var parcel = new Parcel({
        value: {
            a: 1,
            b: 2
        }
    });

    let {value} = new ChangeRequest(action)
        .setBaseParcel(parcel)
        .data();

    var expectedValue = {
        a: 1,
        b: 3
    };

    t.deepEqual(expectedValue, value);
});

test('ChangeRequest data() should get latest parcel data from treeshare when called to prevent basing onto stale data', t => {
    t.plan(1);

    var action = new Action({
        type: "set",
        keyPath: ["b"],
        payload: {
            value: 3
        }
    });

    var ref = {};

    var parcel = new Parcel({
        value: {
            a: 1,
            b: 2
        },
        handleChange: (parcel) => {
            let {value} = ref.changeRequest.data();

            var expectedValue = {
                a: 4,
                b: 3
            };

            t.deepEqual(expectedValue, value);
        }
    });

    ref.changeRequest = new ChangeRequest(action).setBaseParcel(parcel);
    parcel.get('a').onChange(4);
});


test('ChangeRequest should throw error if data() is called before setBaseParcel()', t => {
    t.is(t.throws(() => new ChangeRequest().data(), Error).message, `ChangeRequest data() cannot be called before calling setBaseParcel()`);
});

test('ChangeRequest value() should be a shortcut for data().value', t => {
    var action = new Action({
        type: "set",
        keyPath: ["b"],
        payload: {
            value: 3
        }
    });

    var parcel = new Parcel({
        value: {
            a: 1,
            b: 2
        }
    });

    let value = new ChangeRequest(action)
        .setBaseParcel(parcel)
        .value();

    var expectedValue = {
        a: 1,
        b: 3
    };

    t.deepEqual(expectedValue, value);
});

test('ChangeRequest meta() should be a shortcut for data().meta', t => {
    var action = new Action({
        type: "setMeta",
        payload: {
            meta: {
                abc: 123
            }
        }
    });

    var parcel = new Parcel();

    let meta = new ChangeRequest(action)
        .setBaseParcel(parcel)
        .meta();

    var expectedMeta = {
        abc: 123
    };

    t.deepEqual(expectedMeta, meta);
});

test('ChangeRequest should keep originId and originPath', t => {
    t.plan(2);

    var data = {
        value: {
            abc: 123
        },
        handleChange: (parcel: Parcel, changeRequest: ChangeRequest) => {
            t.deepEqual(['abc'], changeRequest.originPath());
            t.deepEqual('^.abc', changeRequest.originId());
        }
    };

    new Parcel(data)
        .get('abc')
        .onChange(456);
        //.modifyChangeValue(value => value + 1)
});


test('ChangeRequest should keep originId and originPath even when going through a batch() where another change is fired before the original one', t => {
    t.plan(2);

    var data = {
        value: {
            abc: 123,
            def: 456
        },
        handleChange: (parcel: Parcel, changeRequest: ChangeRequest) => {
            t.deepEqual(['abc'], changeRequest.originPath());
            t.deepEqual('^.~mc.abc', changeRequest.originId());
        }
    };

    new Parcel(data)
        .modifyChange((parcel, changeRequest) => {
            parcel.set('def', 789);
            parcel.dispatch(changeRequest);
        })
        .get('abc')
        .onChange(456);
});
