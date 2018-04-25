// @flow
import test from 'ava';
import isModifier from '../isModifier';

test('isModifier should identify modifiers', tt => {
    tt.false(isModifier()("thing"));
    tt.true(isModifier()("&thing&"));
});
