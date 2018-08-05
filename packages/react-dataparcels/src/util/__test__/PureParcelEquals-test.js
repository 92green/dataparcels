// @flow
import PureParcelEquals from '../PureParcelEquals';
import Parcel from 'dataparcels';

test('PureParcelEquals should test equality to see if a re-render should occur', () => {
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

    expect(PureParcelEquals(parcelCreator(), parcelCreator())).toBe(true);
    expect(PureParcelEquals(parcelCreator(), parcelCreator({value: 456}))).toBe(false);
    expect(PureParcelEquals(parcelCreator(), parcelCreator({meta: {abc: 123}}))).toBe(false);
    expect(PureParcelEquals(parcelCreator(), parcelCreator({child: {}}))).toBe(false);
    expect(PureParcelEquals(parcelCreator(), parcelCreator({key: "b"}))).toBe(false);
});
