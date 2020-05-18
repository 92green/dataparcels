// @flow
import Parcel from '../../parcel/Parcel';
import arrange from '../arrange';
import {Item} from '../arrange';
import reverse from 'unmutable/reverse';
import toArray from 'unmutable/toArray';

test.skip('arrange should accept updater', () => {

    let arranger = jest.fn(() => ({}));

    let p = new Parcel({
        value: 123
    })
        .modifyDown(arrange(
            arranger
        ));

    expect(p.value).toBe(123);
    expect(arranger).toHaveBeenCalledTimes(1);
    expect(arranger.mock.calls[0][0].value).toBe(123);
});

test.skip('arrange should update non-parent values', () => {
    let p = new Parcel({
        value: 100
    })
        .modifyDown(arrange(
            ({value}) => ({value: value + 200})
        ));

    expect(p.value).toBe(300);
});

test.skip('arrange should update parent values to non-parent values', () => {
    let p = new Parcel({
        value: [1,2,3]
    })
        .modifyDown(arrange(
            ({value}) => ({value: value.map(item => item.value).join(", ")})
        ));

    expect(p.value).toBe('1, 2, 3');
});

test.skip('arrange should update parent values', () => {
    let p = new Parcel({
        value: [1,2,3]
    })
        .modifyDown(arrange(
            ({value}) => {
                value.reverse();
                return {value};
            }
        ));

    expect(p.value).toEqual([3,2,1]);
    expect(p.get(0).key).toBe('#2');
});

test.skip('arrange should update parent values changing type', () => {
    let parcelData = {
        value: {foo: 'bar', baz: 'qux'}
    };

    let result = arrange(toArray())(parcelData);

    expect(result.value).toEqual(['bar', 'qux']);
    // keys should have been recalculated
    expect(result.child[0].key).toBe('#a');
});

test.skip('arrange should update parent values adding a new Item', () => {
    let parcelData = {
        value: [1,2,3]
    };

    let result = arrange(arr => [...arr, new Item(4)])(parcelData);
    expect(result.value).toEqual([1,2,3,4]);
    expect(result.child[3].key).toBe('#d');
});

test.skip('arrange should update parent values adding a new non-Item', () => {
    let parcelData = {
        value: [1,2,3]
    };

    let result = arrange(arr => [...arr, 4])(parcelData);
    expect(result.value).toEqual([1,2,3,4]);
    expect(result.child[3].key).toBe('#d');
});

test.skip('arrange should update parent values adding duplicated Items', () => {
    let parcelData = {
        value: [1,2,3]
    };

    let result = arrange(arr => [...arr, ...arr])(parcelData);
    expect(result.value).toEqual([1,2,3,1,2,3]);
    expect(result.child[3].key).toBe('#d');
    expect(result.child[4].key).toBe('#e');
    expect(result.child[5].key).toBe('#f');
});
