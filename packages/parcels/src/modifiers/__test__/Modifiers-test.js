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
