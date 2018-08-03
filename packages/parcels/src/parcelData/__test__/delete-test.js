// @flow
import del from '../delete';

test('delete should work by index', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,3],
        child: [
            {key:"#a"},
            {key:"#c"}
        ]
    };

    expect(expectedParcelData).toEqual(del(1)(parcelData));
});


test('delete should work by key', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,3],
        child: [
            {key:"#a"},
            {key:"#c"}
        ]
    };

    expect(expectedParcelData).toEqual(del("#b")(parcelData));
});

test('delete should work by non-existent key', () => {
    let parcelData = {
        value: [1,3],
        child: [
            {key:"#a"},
            {key:"#c"}
        ]
    };

    expect(parcelData).toEqual(del("#b")(parcelData));
});
