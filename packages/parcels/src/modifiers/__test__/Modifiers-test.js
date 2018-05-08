// @flow
import test from 'ava';
import Modifiers from '../Modifiers';

test('Modifiers should accept and return modifier objects', (tt: Object) => {
    let modifiers = [
        {
            modifier: () => {},
            match: undefined
        },
        {
            modifier: () => {},
            match: undefined
        }
    ];

    tt.deepEqual(modifiers, new Modifiers(modifiers).toJS());
});

test('Modifiers should turn modifier functions into modifier objects', (tt: Object) => {
    let modifier = () => {};
    let expectedModifier = [{
        modifier
    }];

    tt.deepEqual(expectedModifier, new Modifiers([modifier]).toJS());
});

test('Modifiers should cope with being passed into other modifier constructors', (tt: Object) => {
    let modifiers = [
        {
            modifier: () => {},
            match: "*:Indexed"
        },
        {
            modifier: () => {},
            match: undefined
        }
    ];

    var js = new Modifiers(modifiers).toJS();
    tt.deepEqual(modifiers, new Modifiers(js).toJS());
});

test('Modifiers should add()', (tt: Object) => {
    let modifier = () => {};
    let modifier2 = () => {};
    let modifier2Object = {
        modifier: modifier2
    };

    let expectedModifier = [
        {
            modifier
        },
        {
            modifier: modifier2
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
            modifier: modifier2
        }
    ];

    tt.deepEqual(expectedModifier, new Modifiers([modifier]).set([modifier2]).toJS());
    tt.deepEqual(expectedModifier, new Modifiers([modifier]).set([modifier2Object]).toJS());
});

test('Modifiers should _processMatch()', (tt: Object) => {
    tt.is(undefined, new Modifiers()._processMatch(undefined), "_processMatch() can cope with undefined");
    tt.is("abc:*", new Modifiers()._processMatch("abc"), "_processMatch() can cope with simple key");
    tt.is("abc:*.def:*.ghi:*", new Modifiers()._processMatch("abc.def.ghi"), "_processMatch() can cope with deep key");
    tt.is("*:*I*", new Modifiers()._processMatch("*:Indexed"), "_processMatch() can cope with a type");
    tt.is("*:*i*", new Modifiers()._processMatch("*:!Indexed"), "_processMatch() can cope with a not type");
    tt.is("hello:*C*P*", new Modifiers()._processMatch("hello:Parent|Child"), "_processMatch() can cope with a multi type");
    tt.is("**.*:*", new Modifiers()._processMatch("**.*"), "_processMatch() can cope with a globstar");
    //tt.is(tt.throws(() => new Modifiers()._processMatch("*:Notexist"), Error).message, `"Notexist" is not a valid type selector.`); TODO!
});

