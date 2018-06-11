// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('Parcel should store debugRender in treeshare', tt => {
    tt.false(new Parcel()._treeshare.getDebugRender());
    tt.true(new Parcel({debugRender: true})._treeshare.getDebugRender());
});
