// @flow
import StaticParcel from '../StaticParcel';

test('StaticParcels insertAfter(key, value) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.insertAfter(0, 3).data.value).toEqual([0,3,1,2]);
});

test('StaticParcels insertBefore(key, value) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.insertBefore(0, 3).data.value).toEqual([3,0,1,2]);
});

test('StaticParcels push(value) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.push(3,4).data.value).toEqual([0,1,2,3,4]);
});

test('StaticParcels pop() should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.pop().data.value).toEqual([0,1]);
});

test('StaticParcels shift() should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.shift().data.value).toEqual([1,2]);
});

test('StaticParcels swap() should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.swap(0,2).data.value).toEqual([2,1,0]);
});

test('StaticParcels swapNext() should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.swapNext(1).data.value).toEqual([0,2,1]);
});

test('StaticParcels swapPrev() should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.swapPrev(1).data.value).toEqual([1,0,2]);
});

test('StaticParcels unshift(value) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: [0,1,2]
    });

    expect(staticParcel.unshift(3,4).data.value).toEqual([3,4,0,1,2]);
});
