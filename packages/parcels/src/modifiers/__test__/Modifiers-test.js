// @flow
import test from 'ava';
import Modifiers from '../Modifiers';

test('Modifiers should accept and return modifier objects', (tt: Object) => {
    let modifiers = [
        {
            modifier: () => {},
            glob: undefined
        },
        {
            modifier: () => {},
            glob: undefined
        }
    ];

    tt.deepEqual(modifiers, new Modifiers(modifiers).toJS());
});

test('Modifiers should turn modifier functions into modifier objects', (tt: Object) => {
    let modifier = () => {};
    let expectedModifier = [{
        modifier,
        glob: undefined
    }];

    tt.deepEqual(expectedModifier, new Modifiers([modifier]).toJS());
});

test('Modifiers should add()', (tt: Object) => {
    let modifier = () => {};
    let modifier2 = () => {};
    let modifier2Object = {
        modifier: modifier2
    };

    let expectedModifier = [
        {
            modifier,
            glob: undefined
        },
        {
            modifier: modifier2,
            glob: undefined
        }
    ];

    tt.deepEqual(expectedModifier, new Modifiers([modifier]).add(modifier2).toJS());
    tt.deepEqual(expectedModifier, new Modifiers([modifier]).add(modifier2Object).toJS());
});

test('Modifiers should isEmpty()', (tt: Object) => {
    tt.false(new Modifiers([() => {}]).isEmpty());
    tt.true(new Modifiers().isEmpty());
});


test('Modifiers should set()', (tt: Object) => {
    let modifier = () => {};
    let modifier2 = () => {};
    let modifier2Object = {
        modifier: modifier2
    };

    let expectedModifier = [
        {
            modifier: modifier2,
            glob: undefined
        }
    ];

    tt.deepEqual(expectedModifier, new Modifiers([modifier]).set([modifier2]).toJS());
    tt.deepEqual(expectedModifier, new Modifiers([modifier]).set([modifier2Object]).toJS());
});

test('Modifiers should _processGlob()', (tt: Object) => {
    tt.is(undefined, new Modifiers()._processGlob(undefined), "_processGlob() can cope with undefined");
    tt.is("abc:*", new Modifiers()._processGlob("abc"), "_processGlob() can cope with simple key");
    tt.is("abc:*/def:*/ghi:*", new Modifiers()._processGlob("abc/def/ghi"), "_processGlob() can cope with deep key");
    tt.is("*:*I*", new Modifiers()._processGlob("*:Indexed"), "_processGlob() can cope with a type");
    tt.is("*:*i*", new Modifiers()._processGlob("*:!Indexed"), "_processGlob() can cope with a not type");
    tt.is("hello:*C*P*", new Modifiers()._processGlob("hello:Parent|Child"), "_processGlob() can cope with a multi type");
    //tt.is(tt.throws(() => new Modifiers()._processGlob("*:Notexist"), Error).message, `"Notexist" is not a valid type selector.`); TODO!
});
