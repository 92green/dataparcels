// @flow
import test from 'ava';
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';

test('ChangeRequest should build an action', tt => {
    let expectedDefaultData = {
        actions: [],
        meta: {},
        originId: null,
        originPath: null,
    };
    tt.deepEqual(expectedDefaultData, new ChangeRequest().toJS());
});

test('ChangeRequest actions() should get actions', tt => {
    let actions = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    tt.deepEqual(actions, new ChangeRequest(actions).actions());
});

test('ChangeRequest updateActions() should update actions', tt => {
    let actions = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    tt.deepEqual([actions[0]], new ChangeRequest(actions)
        .updateActions(actions => actions.filter(aa => aa.type === "???"))
        .actions()
    );
});

test('ChangeRequest merge() should merge other change requests actions', tt => {
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

    tt.deepEqual(
        [...actionsA, ...actionsB],
        merged.actions()
    );

    // TODO - test originId, originPath and meta
});


test('ChangeRequest setMeta() and meta() should work', tt => {
    let expectedMeta = {
        a: 3,
        b: 2
    };
    tt.deepEqual(
        expectedMeta,
        new ChangeRequest()
            .setMeta({a: 1})
            .setMeta({b: 2})
            .setMeta({a: 3})
            .meta()
    );
});

test('ChangeRequest _unget() should prepend key', tt => {
    let actions = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    let expectedKeyPaths = [
        ['b', 'a'],
        ['b', 'a']
    ];

    tt.deepEqual(
        expectedKeyPaths,
        new ChangeRequest(actions)
            ._unget('b')
            .actions()
            .map(aa => aa.keyPath)
    );
});

test('ChangeRequest setBase() and data() should use Reducer', tt => {
    var action = new Action({
        type: "set",
        keyPath: ["b"],
        payload: {
            value: 3
        }
    });

    var data = {
        value: {
            a: 1,
            b: 2
        }
    };

    let {value} = new ChangeRequest(action)
        .setBase(data)
        .data();

    var expectedValue = {
        a: 1,
        b: 3
    };

    tt.deepEqual(expectedValue, value);
});


test('ChangeRequest should throw error if data() is called before setBase()', tt => {
    tt.is(tt.throws(() => new ChangeRequest().data(), Error).message, `ChangeRequest data() cannot be called before calling setBase()`);
});
