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

test('ParcelBoundaryEquals should return false if isFirst or isLast change', () => {
    var child = {};

    let p2 = new Parcel({
        value: [123,456]
    });

    let p = new Parcel({
        value: [123,456],
        handleChange: (newParcel) => {
            p2 = newParcel;
        }
    });

    p.push(789);

    // #a should be true as it hasnt changed value and is still first and not last
    expect(ParcelBoundaryEquals(p.get("#a"), p2.get("#a"))).toBe(true);
    // #b should be false as it used to be last but now isnt (value and meta are the same)
    expect(ParcelBoundaryEquals(p.get("#b"), p2.get("#b"))).toBe(false);

    p.unshift(101112);
    // #a should be false as it used to be first but now isnt (value and meta are the same)
    expect(ParcelBoundaryEquals(p.get("#a"), p2.get("#a"))).toBe(false);
});
