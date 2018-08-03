// @flow
import shift from '../shift';

test('shift should work', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [2,3],
        child: [
            {key:"#b"},
            {key:"#c"}
        ]
    };

    expect(expectedParcelData).toEqual(shift()(parcelData));
});
