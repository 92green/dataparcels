// @flow
import wrapNumber from '../wrapNumber';

test('wrapNumber passes through values where min <= value < max', () => {
    expect(wrapNumber(0, 10)).toBe(0);
    expect(wrapNumber(3, 10)).toBe(3);
    expect(wrapNumber(6, 7)).toBe(6);
});

test('wrapNumber wraps values equal to or higher than max', () => {
    expect(wrapNumber(10, 10)).toBe(0);
    expect(wrapNumber(13, 10)).toBe(3);
    expect(wrapNumber(103, 10)).toBe(3);
});

test('wrapNumber wraps values smaller than min', () => {
    expect(wrapNumber(-1, 10)).toBe(9);
    expect(wrapNumber(-2, 10)).toBe(8);
    expect(wrapNumber(-32, 10)).toBe(8);
});
