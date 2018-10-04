// @flow
import ParcelBoundaryEquals from '../ParcelBoundaryEquals';
import Parcel from 'dataparcels';

test('ParcelBoundaryEquals should test equality to see if a re-render should occur', () => {
    var child = {};
    var parcelCreator = (merge = {}) => {
        let p = new Parcel();
        // $FlowFixMe
        p._parcelData = {
            value: 123,
            meta: {
                abc: 123,
                def: 456
            },
            key: "a",
            child,
            ...merge
        };
        return p;
    };

    expect(ParcelBoundaryEquals(parcelCreator(), parcelCreator())).toBe(true);
    expect(ParcelBoundaryEquals(parcelCreator(), parcelCreator({value: 456}))).toBe(false);
    expect(ParcelBoundaryEquals(parcelCreator(), parcelCreator({meta: {abc: 123}}))).toBe(false);
    expect(ParcelBoundaryEquals(parcelCreator(), parcelCreator({child: {}}))).toBe(false);
    expect(ParcelBoundaryEquals(parcelCreator(), parcelCreator({key: "b"}))).toBe(false);
});
