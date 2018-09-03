// @flow
import swapPrev from '../swapPrev';

test('swapPrev should work', () => {
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
    expect(expectedParcelData).toEqual(swapPrev(2)(parcelData));
    expect(expectedParcelData).toEqual(swapPrev(-1)(parcelData));
    expect(expectedParcelData).toEqual(swapPrev(5)(parcelData));
    expect(expectedParcelData).toEqual(swapPrev(-4)(parcelData));
});

test('swapPrev should work with hashKeys', () => {
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

    expect(expectedParcelData).toEqual(swapPrev("#c")(parcelData));
});

test('swapPrev should work with zero', () => {
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


    expect(expectedParcelData).toEqual(swapPrev(0)(parcelData));
});

test('swapPrev should do nothing if given non existent key', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    expect(parcelData).toEqual(swapPrev("#z")(parcelData));
});
