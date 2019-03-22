// @flow
import HashString from '../HashString';

test('HashString should make a hash from a string', () => {
    expect(HashString("abc")).toBe(96354);
    expect(HashString("def")).toBe(99333);
});

test('HashString should make a hash from an empty string', () => {
    expect(HashString("")).toBe(0);
});
