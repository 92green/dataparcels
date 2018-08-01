// @flow
import test from 'ava';
import PureParcelEquals from '../PureParcelEquals';
import Parcel from 'parcels';

test('PureParcelEquals should test equality to see if a re-render should occur', t => {
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

    t.true(PureParcelEquals(parcelCreator(), parcelCreator()), 'parcel equals self');
    t.false(PureParcelEquals(parcelCreator(), parcelCreator({value: 456})), 'parcel doesnt equals different value');
    t.false(PureParcelEquals(parcelCreator(), parcelCreator({meta: {abc: 123}})), 'parcel doesnt equals different meta contents');
    t.false(PureParcelEquals(parcelCreator(), parcelCreator({child: {}})), 'parcel doesnt equals different child');
    t.false(PureParcelEquals(parcelCreator(), parcelCreator({key: "b"})), 'parcel doesnt equals different key');
});
