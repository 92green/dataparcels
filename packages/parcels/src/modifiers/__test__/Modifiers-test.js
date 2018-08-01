// @flow
import test from 'ava';
import Modifiers from '../Modifiers';

test('Modifiers should accept and return modifier objects', (t: Object) => {
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

    t.deepEqual(modifiers, new Modifiers(modifiers).toJS());
});

test('Modifiers should turn modifier functions into modifier objects', (t: Object) => {
    let modifier = () => {};
    let expectedModifier = [{
        modifier
    }];

    t.deepEqual(expectedModifier, new Modifiers([modifier]).toJS());
});

test('Modifiers should cope with being passed into other modifier constructors', (t: Object) => {
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
    t.deepEqual(modifiers, new Modifiers(js).toJS());
});

test('Modifiers should add()', (t: Object) => {
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

    t.deepEqual(expectedModifier, new Modifiers([modifier]).add(modifier2).toJS());
    t.deepEqual(expectedModifier, new Modifiers([modifier]).add(modifier2Object).toJS());
});

test('Modifiers should isEmpty()', (t: Object) => {
    t.false(new Modifiers([() => {}]).isEmpty());
    t.true(new Modifiers().isEmpty());
});


test('Modifiers should set()', (t: Object) => {
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

    t.deepEqual(expectedModifier, new Modifiers([modifier]).set([modifier2]).toJS());
    t.deepEqual(expectedModifier, new Modifiers([modifier]).set([modifier2Object]).toJS());
});
