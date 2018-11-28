// @flow
import Action from '../Action';
import ActionKeyPathModifier from '../ActionKeyPathModifier';

test('Action should build an action', () => {
    let expectedDefaultData = {
        type: "",
        payload: {},
        keyPath: [],
        keyPathModifiers: []
    };
    expect(new Action().toJS()).toEqual(expectedDefaultData);
});

test('Action should build an action with a type', () => {
    expect(new Action({type: "???"}).type).toBe("???");
});

test('Action should build an action with a payload', () => {
    expect(new Action({type: "???", payload: {a: 1}}).payload).toEqual({a: 1});
});

test('Action should build an action with a default payload', () => {
    expect(new Action({type: "???"}).payload).toEqual({});
});

test('Action should build an action with a keyPath', () => {
    expect(new Action({type: "???", keyPath: ['a', 'b']}).keyPath).toEqual(['a', 'b']);
});

test('Action should build an action with a default keyPath', () => {
    expect(new Action({type: "???"}).keyPath).toEqual([]);
});

test('Action should be synchronous if it has a type of ping, else not', () => {
    expect(new Action({type: "ping"}).shouldBeSynchronous()).toBe(true);
    expect(new Action({type: "set"}).shouldBeSynchronous()).toBe(false);
    expect(new Action({type: "???"}).shouldBeSynchronous()).toBe(false);
});

test('Action _unget should unshift key to front of empty keyPath', () => {
    let action = {
        type: "woo",
        payload: {abc: 123},
        keyPath: [],
        keyPathModifiers: []
    };

    let {keyPath, keyPathModifiers} = new Action(action)
        ._unget('a')
        .toJS();

    expect(keyPath).toEqual(['a']);
    expect(keyPathModifiers.map(_ => _.toJS())).toEqual([
        {key: "a", pre: [], post: []}
    ]);
});

test('Action _unget should unshift key to front of keyPath', () => {
   let action = {
        type: "woo",
        payload: {abc: 123},
        keyPath: ['a']
    };

    let {keyPath, keyPathModifiers} = new Action(action)
        ._unget('b')
        .toJS();

    expect(keyPath).toEqual(['b', 'a']);
    expect(keyPathModifiers.map(_ => _.toJS())).toEqual([
        {key: "b", pre: [], post: []},
        {key: "a", pre: [], post: []}
    ]);
});

test('Action _unget should unshift key into new keypathmodifier where pre already exists', () => {
    let fn = ii => ii;

    let action = {
        type: "woo",
        payload: {abc: 123},
        keyPath: [],
        keyPathModifiers: [
            new ActionKeyPathModifier({key: undefined, pre: [fn]})
        ]
    };

    let {keyPath, keyPathModifiers} = new Action(action)
        ._unget('a')
        .toJS();

    expect(keyPath).toEqual(['a']);
    expect(keyPathModifiers.map(_ => _.toJS())).toEqual([
        {key: "a", pre: [], post: []},
        {key: undefined, pre: [fn], post: []}
    ]);
});

test('Action _addPre and _addPost should put pre and post functions in empty keyPathModifiers', () => {
    let action = {
        type: "woo",
        payload: {abc: 123},
        keyPath: []
    };

    let pre = ii => ii;
    let post = ii => ii;

    let withPre = new Action(action)
        ._addPre(pre)
        .toJS()
        .keyPathModifiers;

    let withPost = new Action(action)
        ._addPost(post)
        .toJS()
        .keyPathModifiers;

    expect(withPre.map(_ => _.toJS())).toEqual([
        {key: undefined, pre: [pre], post: []}
    ]);

    expect(withPost.map(_ => _.toJS())).toEqual([
        {key: undefined, post: [post], pre: []}
    ]);
});

test('Action _addPre and _addPost should put pre and post functions into first keyPathModifiers', () => {
    let action = {
        type: "woo",
        payload: {abc: 123},
        keyPath: ['a'],
        keyPathModifiers: [
            new ActionKeyPathModifier({key: 'a'})
        ]
    };

    let pre = ii => ii;
    let post = ii => ii;

    let withPre = new Action(action)
        ._addPre(pre)
        .toJS()
        .keyPathModifiers;

    let withPost = new Action(action)
        ._addPost(post)
        .toJS()
        .keyPathModifiers;

    expect(withPre.map(_ => _.toJS())).toEqual([
        {key: 'a', pre: [pre], post: []}
    ]);

    expect(withPost.map(_ => _.toJS())).toEqual([
        {key: 'a', pre: [], post: [post]}
    ]);
});

test('Action _addPre and _addPost should put pre and post functions in same keyPathModifiers', () => {
   let action = {
        type: "woo",
        payload: {abc: 123},
        keyPath: ['a'],
        keyPathModifiers: [
            new ActionKeyPathModifier({key: 'a'})
        ]
    };

    let pre = ii => ii;
    let post = ii => ii;

    let withPreAndPost = new Action(action)
        ._addPre(pre)
        ._addPost(post)
        .toJS()
        .keyPathModifiers;

    expect(withPreAndPost.map(_ => _.toJS())).toEqual([
        {key: 'a', post: [post], pre: [pre]}
    ]);
});

test('Action _addPre twice should put pre functions in same keyPathModifiers, in reverse order', () => {
   let action = {
        type: "woo",
        payload: {abc: 123},
        keyPath: ['a'],
        keyPathModifiers: [
            new ActionKeyPathModifier({key: 'a'})
        ]
    };

    let pre = ii => ii;
    let pre2 = ii => ii;

    let withPre = new Action(action)
        ._addPre(pre)
        ._addPre(pre2)
        .toJS()
        .keyPathModifiers;

    expect(withPre.map(_ => _.toJS())).toEqual([
        {key: 'a', post: [], pre: [pre2, pre]}
    ]);
});

test('Action _addPost twice should put post functions in same keyPathModifiers', () => {
   let action = {
        type: "woo",
        payload: {abc: 123},
        keyPath: ['a'],
        keyPathModifiers: [
            new ActionKeyPathModifier({key: 'a'})
        ]
    };

    let post = ii => ii;
    let post2 = ii => ii;

    let withPost = new Action(action)
        ._addPost(post)
        ._addPost(post2)
        .toJS()
        .keyPathModifiers;

    expect(withPost.map(_ => _.toJS())).toEqual([
        {key: 'a', post: [post, post2], pre: []}
    ]);
});
test('Action should be value action if it isnt ping or setMeta', () => {
    expect(new Action({type: "ping"}).isValueAction()).toBe(false);
    expect(new Action({type: "set"}).isValueAction()).toBe(true);
    expect(new Action({type: "setMeta"}).isValueAction()).toBe(false);
});

test('Action should be meta action if it is setMeta', () => {
    expect(new Action({type: "ping"}).isMetaAction()).toBe(false);
    expect(new Action({type: "set"}).isMetaAction()).toBe(false);
    expect(new Action({type: "setMeta"}).isMetaAction()).toBe(true);
});
