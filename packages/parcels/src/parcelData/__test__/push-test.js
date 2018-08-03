// @flow
import push from '../push';

test('push should work', () => {
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


    expect(expectedParcelData).toEqual(push({value: 4})(parcelData));
});
