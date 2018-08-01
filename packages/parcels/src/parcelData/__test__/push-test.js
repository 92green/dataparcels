// @flow
import test from 'ava';
import push from '../push';

test('push should work', (t: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,2,3,4],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"},
            {key:"#d"}
        ]
    };


    t.deepEqual(expectedParcelData, push({value: 4})(parcelData));
});
