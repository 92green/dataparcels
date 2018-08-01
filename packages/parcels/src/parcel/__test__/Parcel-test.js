// @flow
import Parcel from '../Parcel';

test('Parcel should store debugRender in treeshare', () => {
    expect(new Parcel()._treeshare.getDebugRender()).toBe(false);
    expect(new Parcel({debugRender: true})._treeshare.getDebugRender()).toBe(true);
});
