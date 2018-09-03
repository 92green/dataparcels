// @flow
import swapNext from '../swapNext';

test('swapNext should work with indexes', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,3,2],
        child: [
            {key:"#a"},
            {key:"#c"},
            {key:"#b"}
        ]
    };

    expect(expectedParcelData).toEqual(swapNext(1)(parcelData));
    expect(expectedParcelData).toEqual(swapNext(-2)(parcelData));
    expect(expectedParcelData).toEqual(swapNext(4)(parcelData));
    expect(expectedParcelData).toEqual(swapNext(-5)(parcelData));
});

test('swapNext should work with hashKeys', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,3,2],
        child: [
            {key:"#a"},
            {key:"#c"},
            {key:"#b"}
        ]
    };

    expect(expectedParcelData).toEqual(swapNext("#b")(parcelData));
});

test('swapNext should work with length - 1', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [3,2,1],
        child: [
            {key:"#c"},
            {key:"#b"},
            {key:"#a"}
        ]
    };


    expect(expectedParcelData).toEqual(swapNext(2)(parcelData));
});

test('swapNext should do nothing if given non existent key', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    expect(parcelData).toEqual(swapNext("#z")(parcelData));
});
