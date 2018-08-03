// @flow
import Modifiers from '../Modifiers';

test('Modifiers should accept and return modifier objects', () => {
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

    expect(modifiers).toEqual(new Modifiers(modifiers).toJS());
});

test('Modifiers should turn modifier functions into modifier objects', () => {
    let modifier = () => {};
    let expectedModifier = [{
        modifier
    }];

    expect(expectedModifier).toEqual(new Modifiers([modifier]).toJS());
});

test('Modifiers should cope with being passed into other modifier constructors', () => {
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
    expect(modifiers).toEqual(new Modifiers(js).toJS());
});

test('Modifiers should add()', () => {
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

    expect(expectedModifier).toEqual(new Modifiers([modifier]).add(modifier2).toJS());
    expect(expectedModifier).toEqual(new Modifiers([modifier]).add(modifier2Object).toJS());
});

test('Modifiers should isEmpty()', () => {
    expect(new Modifiers([() => {}]).isEmpty()).toBe(false);
    expect(new Modifiers().isEmpty()).toBe(true);
});


test('Modifiers should set()', () => {
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

    expect(expectedModifier).toEqual(new Modifiers([modifier]).set([modifier2]).toJS());
    expect(expectedModifier).toEqual(new Modifiers([modifier]).set([modifier2Object]).toJS());
});
