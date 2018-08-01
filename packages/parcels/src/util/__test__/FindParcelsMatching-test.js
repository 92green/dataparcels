// @flow
import test from 'ava';
import Parcel from 'parcels';
import FindParcelsMatching from '../FindParcelsMatching';

test(`FindParcelsMatching() should return all parcels matching the match string at or below the start parcel's depth`, t => {

    let p = new Parcel({
        value: {
            abc: {
                def: 123,
                ghi: 456
            },
            jkl: {
                mno: 789
            }
        }
    });

    t.deepEqual(["abc"], FindParcelsMatching(p, "abc").map(ii => ii.path().join(".")));
    t.deepEqual(["abc.def"], FindParcelsMatching(p, "abc.def").map(ii => ii.path().join(".")));
    t.deepEqual([], FindParcelsMatching(p, "abc.def.toofar").map(ii => ii.path().join(".")));
    t.deepEqual([], FindParcelsMatching(p, "abc.woo").map(ii => ii.path().join(".")));
    t.deepEqual([], FindParcelsMatching(p, "asdf%.kasd.asdasd.asd").map(ii => ii.path().join(".")));
    t.deepEqual(["abc.def", "abc.ghi"], FindParcelsMatching(p, "abc.*").map(ii => ii.path().join(".")));
    t.deepEqual(["abc.def"], FindParcelsMatching(p.get('abc'), "abc.def").map(ii => ii.path().join(".")));
    t.deepEqual([], FindParcelsMatching(p.get('mno'), "abc.def").map(ii => ii.path().join(".")));
    t.deepEqual(["abc.def","abc.ghi","jkl.mno"], FindParcelsMatching(p, "*.*").map(ii => ii.path().join(".")));
});
