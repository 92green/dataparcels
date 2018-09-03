// @flow
import Parcel from 'dataparcels';
import FindParcelsMatching from '../FindParcelsMatching';

test(`FindParcelsMatching() should return all parcels matching the match string at or below the start parcel's depth`, () => {

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

    expect(["abc"]).toEqual(FindParcelsMatching(p, "abc").map(ii => ii.path.join(".")));
    expect(["abc.def"]).toEqual(FindParcelsMatching(p, "abc.def").map(ii => ii.path.join(".")));
    expect([]).toEqual(FindParcelsMatching(p, "abc.def.toofar").map(ii => ii.path.join(".")));
    expect([]).toEqual(FindParcelsMatching(p, "abc.woo").map(ii => ii.path.join(".")));
    expect([]).toEqual(
        FindParcelsMatching(p, "asdf%.kasd.asdasd.asd").map(ii => ii.path.join("."))
    );
    expect(["abc.def", "abc.ghi"]).toEqual(FindParcelsMatching(p, "abc.*").map(ii => ii.path.join(".")));
    expect(["abc.def"]).toEqual(
        FindParcelsMatching(p.get('abc'), "abc.def").map(ii => ii.path.join("."))
    );
    expect([]).toEqual(
        FindParcelsMatching(p.get('mno'), "abc.def").map(ii => ii.path.join("."))
    );
    expect(["abc.def","abc.ghi","jkl.mno"]).toEqual(FindParcelsMatching(p, "*.*").map(ii => ii.path.join(".")));
});
