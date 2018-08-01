// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('Parcel should store debugRender in treeshare', t => {
    t.false(new Parcel()._treeshare.getDebugRender());
    t.true(new Parcel({debugRender: true})._treeshare.getDebugRender());
});
