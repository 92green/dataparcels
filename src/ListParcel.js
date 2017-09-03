// @flow
import {Wrap} from 'unmutable';
import Parcel from './Parcel';
import ParcelFactory from './ParcelFactory';
import incrementId from './util/incrementId';
import wrapNumber from './util/wrapNumber';
import sanitiseParcelData from './util/sanitiseParcelData';

export default class ListParcel extends Parcel {
    constructor(parcelData: ParcelData, handleChange: HandleChange) {
        var {value, meta, keys} = parcelData;

        keys = keys || [];
        var nextKey = incrementId(keys) - 1;

        // add list keys for each indexed item
        // from meta, or if that doesnt exist generate new ones
        keys = Wrap(value)
            .map((ii: *, kk: number): number => {
                if(keys[kk]) {
                    return keys[kk];
                }
                nextKey++;
                return {
                    key: nextKey
                };
            })
            .done();

        super(
            {
                value,
                meta,
                keys
            },
            handleChange
        );

        this._privateMethods = {
            ...this._privateMethods,
            newKey: (): Key => ({
                key: incrementId(this._privateData.keys)
            })
        };
    }

    delete: Function = (index: number) => {
        const {processValue, processMeta, processKeys} = this._privateMethods;
        const del = ii => ii.delete(index);

        const newData = {
            value: processValue(del),
            meta: processMeta(del),
            keys: processKeys(del)
        };

        const action = {
            type: "delete",
            payload: {
                keyPath: [index]
            }
        };

        this._privateMethods.handleChange(newData, action);
    };

    insert: Function = (index: number, parcelData: ParcelData) => {
        const {processValue, processMeta, processKeys} = this._privateMethods;
        parcelData = sanitiseParcelData(parcelData);

        const newData = {
            value: processValue(ii => ii.insert(index, parcelData.value)),
            meta: processMeta((ii, kk) => ii.insert(index, parcelData[kk])),
            keys: processKeys((ii) => ii.insert(index, this._privateMethods.newKey()))
        };

        const action = {
            type: "insert",
            payload: {
                value: parcelData.value,
                meta: parcelData.meta,
                keyPath: [index]
            }
        }

        this._privateMethods.handleChange(newData, action);
    };

    push: Function = (parcelData: ParcelData) => {
        const {processValue, processMeta, processKeys} = this._privateMethods;
        parcelData = sanitiseParcelData(parcelData);

        const newData = {
            value: processValue(ii => ii.push(parcelData.value)),
            meta: processMeta((ii, kk) => ii.push(parcelData.meta[kk])),
            keys: processKeys((ii) => ii.push(this._privateMethods.newKey()))
        };

        // TODO - fix bug where meta isnt saved ^^^

        const action = {
            type: "push",
            payload: {
                value: parcelData.value,
                meta: parcelData.meta,
                keyPath: []
            }
        };

        this._privateMethods.handleChange(newData, action);
    };

    pop: Function = () => {
        const {processValue, processMeta, processKeys} = this._privateMethods;
        const pop = ii => ii.pop();

        const newData = {
            value: processValue(pop),
            meta: processMeta(pop),
            keys: processKeys(pop)
        };

        const action = {
            type: "pop",
            payload: {
                keyPath: []
            }
        };

        this._privateMethods.handleChange(newData, action);
    };

    shift: Function = () => {
        const {processValue, processMeta, processKeys} = this._privateMethods;
        const shift = ii => ii.shift();

        const newData = {
            value: processValue(shift),
            meta: processMeta(shift),
            keys: processKeys(shift)
        };

        const action = {
            type: "shift",
            payload: {
                keyPath: []
            }
        };

        this._privateMethods.handleChange(newData, action);
    };

    size: Function = (): number => {
        return Wrap(this.value()).size;
    };

    swap: Function = (indexA: number, indexB: number) => {
        const {processValue, processMeta, processKeys} = this._privateMethods;

        const size = this.size();
        indexA = wrapNumber(indexA, 0, size);
        indexB = wrapNumber(indexB, 0, size);

        const swap = ii => ii
            .set(indexA, ii.get(indexB).done())
            .set(indexB, ii.get(indexA).done());

        const newData = {
            value: processValue(swap),
            meta: processMeta(swap),
            keys: processKeys(swap)
        };

        const action = {
            type: "swap",
            payload: {
                indexA,
                indexB,
                keyPath: []
            }
        };

        this._privateMethods.handleChange(newData, action);
    };

    swapNext: Function = (index: number) => {
        this.swap(index, index + 1);
    };

    swapPrev: Function = (index: number) => {
        this.swap(index, index - 1);
    };

    unshift: Function = (parcelData: ParcelData) => {
        const {processValue, processMeta, processKeys} = this._privateMethods;
        parcelData = sanitiseParcelData(parcelData);

        const newData = {
            value: processValue(ii => ii.unshift(parcelData.value)),
            meta: processMeta((ii, kk) => ii.unshift(parcelData[kk])),
            keys: processKeys((ii) => ii.unshift(this._privateMethods.newKey()))
        };

        const action = {
            type: "unshift",
            payload: {
                value: parcelData.value,
                meta: parcelData.meta,
                keyPath: []
            }
        };

        this._privateMethods.handleChange(newData, action);
    };
}
