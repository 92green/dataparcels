// @flow
import rekey from '../rekey';

test('rekey should use a dangerous updater, so it will work in beforeChange', () => {
    expect(rekey({})._dangerouslyUpdate).toBe(true);
});

test('rekey should do stuff', () => {

});
