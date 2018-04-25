// @flow
import test from 'ava';
import decodeHashKey from '../decodeHashKey';

test('decodeHashKey should work', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    tt.is(1, decodeHashKey("#b")(parcelData));
    tt.is(1, decodeHashKey(1)(parcelData));
    tt.is("zzz", decodeHashKey("zzz")(parcelData));
});
