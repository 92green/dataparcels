// @flow
import {Wrap} from 'unmutable'; // TODO swap this out with unmutable-lite
import recursiveFilter from './util/recursiveFilter';

//type ModifyValue = (value: *) => *;
//type OnChangeUpdater = (payload: *) => *;
type Mapper = (parcel: Parcel, key: string|number) => *;

function UnwrapParcel(item: *): * {
    return typeof item == "object" && item instanceof Parcel
        ? item.value()
        : item;
}

function SanitiseParcelData(data: ParcelData): ParcelData {
    if(typeof data !== "object" || !data.hasOwnProperty('value')) {
        console.warn(`Parcel must be passed an object with "value" (any type) and optional "meta" object`);
        return {
            value: null,
            meta: {}
        };
    }

    var result = {
        value: null,
        meta: {}
    };

    if(data.hasOwnProperty('value')) {
        result.value = UnwrapParcel(data.value);
    }
    if(data.hasOwnProperty('meta')) {
        if(typeof data.meta !== "object") {
            console.warn(`Parcel meta must be an object`);
        } else {
            result.meta = data.meta;
        }
    }

    if(data.hasOwnProperty('keys')) {
        result.keys = data.keys;
    }

    return result;
}

export default function ParcelFactory(parcelData: ParcelData, handleChange: Function): Parcel {
    parcelData = SanitiseParcelData(parcelData);
    if(Wrap(parcelData.value).isIndexed()) {
        return new ListParcel(parcelData, handleChange);
    }
    return new Parcel(parcelData, handleChange);
}

class Parcel {
    _private: Object;

    constructor(parcelData: ParcelData, handleChange: Function) {
        const _handleChange: Function = (newData: ParcelData) => {

            // remove meta object if it is empty
            if(newData.meta && Wrap(newData.meta).isEmpty()) {
                newData = Wrap(newData).delete('meta').done();
            }

            // remove keys if it is not defined
            const isDefined: Function = ii => typeof ii !== "undefined";
            if(!isDefined(recursiveFilter(newData.keys, isDefined, undefined))) {
                newData = Wrap(newData).delete('keys').done();
            }
            handleChange(newData);
        };

        const onChange: Function = (newValue: *) => {
            _handleChange({
                ...parcelData,
                value: newValue
            });
        };

        const metaChange: Function = (newMeta: Object) => {
            _handleChange({
                ...parcelData,
                meta: newMeta
            });
        };

        const processValue: Function = (updater: Function): * => {
            return updater(Wrap(this.value())).done();
        };

        const processMeta: Function = (updater: Function): * => {
            return Wrap(this.meta())
                .map((ii, kk) => updater(Wrap(ii), kk).done())
                .done();
        };

        const processKeys: Function = (updater: Function): * => {
            return updater(Wrap(this._private.keys || {})).done();
        };

        this._private = {
            ...parcelData,
            handleChange: _handleChange,
            onChange,
            metaChange,
            processValue,
            processMeta,
            processKeys
        };
    }

    value: Function = (): * => {
        return this._private.value;
    };

    meta: Function = (key: ?string): * => {
        const {meta} = this._private;
        if(!key) {
            return meta;
        }
        return meta
            ? meta[key]
            : null;
    };

    key: Function = (): number => {
        return this._private.keys.key;
    };

    onChange: Function = (newValue: *) => {
        this._private.onChange(newValue);
    };

    onChangeDOM: Function = (event: Object) => {
        this.onChange(event.target.value);
    };

    metaChange: Function = (key: ?string): Function => {
        const {metaChange} = this._private;
        if(!key) {
            return metaChange;
        }
        return (newMeta) => metaChange(
            Wrap(this.meta()).set(key, newMeta).done()
        );
    };

    modifyValue: Function = (valueUpdater: ValueUpdater): Parcel => {
        const {processValue, processMeta, processKeys} = this._private;
        return ParcelFactory(
            {
                value: processValue(ii => Wrap(valueUpdater(ii.done()))),
                meta: processMeta(ii => Wrap(valueUpdater(ii.done()))),
                keys: processKeys(ii => ii)
            },
            this._private.handleChange
        );
    };

    modifyChange: Function = (onChangeUpdater: OnChangeUpdater): Parcel => {
        const {processValue, processMeta, processKeys} = this._private;
        return ParcelFactory(
            {
                value: processValue(ii => ii),
                meta: processMeta(ii => ii),
                keys: processKeys(ii => ii)
            },
            (newData: ParcelData) => {
                this._private.handleChange({
                    value: processValue(ii => Wrap(onChangeUpdater(newData.value))),
                    meta: processMeta((ii, kk) => Wrap(onChangeUpdater(newData.meta[kk]))),
                    keys: processKeys(ii => ii)
                });
            }
        );
    };

    get: Function = (key: string, notSetValue: * = undefined): Parcel => {
        const {processValue, processMeta, processKeys} = this._private;
        return ParcelFactory(
            {
                value: processValue(ii => ii.get(key, notSetValue)),
                meta: processMeta(ii => ii.get(key)),
                keys: processKeys(ii => ii.get(key))
            },
            (newData: ParcelData) => {
                this._private.handleChange({
                    value: processValue(ii => ii.set(key, newData.value)),
                    meta: processMeta((ii, kk) => ii.set(key, newData.meta[kk])),
                    keys: processKeys(ii => ii.set(key, newData.keys))
                });
            }
        );
    };

    getIn: Function = (keyPath: Array<string>, notSetValue: * = undefined): Parcel => {
        const {processValue, processMeta, processKeys} = this._private;
        const keysKeyPath = Wrap(keyPath).interpose("children").done();
        return ParcelFactory(
            {
                value: processValue(ii => ii.getIn(keyPath, notSetValue)),
                meta: processMeta(ii => ii.getIn(keyPath)),
                keys: processKeys(ii => ii.getIn(keysKeyPath))
            },
            (newData: ParcelData) => {
                this._private.handleChange({
                    value: processValue(ii => ii.setIn(keyPath, newData.value)),
                    meta: processMeta((ii, kk) => ii.setIn(keyPath, newData.meta[kk])),
                    keys: processKeys(ii => ii.setIn(keysKeyPath, newData.keys))
                });
            }
        );
    };

    map: Function = (mapper: Mapper): Parcel => {
        const {processValue} = this._private;
        return ParcelFactory(
            {
                value: processValue((ii: *): * => { // TODO -these should be typed as UnmutableWrappers
                    return ii.map((value, key) => UnwrapParcel(
                        mapper(this.get(key), key))
                    );
                }),
                meta: this.meta(),
                keys: this._private.keys
            },
            this._private.handleChange
        );
    };

    spread: Function = (): Object => ({
        value: this.value(),
        onChange: this.onChange
    });

    spreadDOM: Function = (): Object => ({
        value: this.value(),
        onChange: this.onChangeDOM
    });
}

function NextListKey(keys: Array<number>): number {
    if(keys.length === 0) {
        return 0;
    }
    return Math.max(...keys.map(ii => ii.key)) + 1;
}

function NumberWrap(val: number, min: number, max: number): number {
    var range = max - min;
    val = (val - min) % range;
    return val < 0 ? val + range : val;
}

class ListParcel extends Parcel {
    constructor(parcelData: ParcelData, handleChange: Function) {
        var {value, meta, keys} = parcelData;

        keys = keys || [];
        var nextKey = NextListKey(keys) - 1;

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

        this._private = {
            ...this._private,
            newKey: (): number => {
                return {
                    key: NextListKey(this._private.keys)
                };
            }
        };
    }

    delete: Function = (index: number) => {
        const {processValue, processMeta, processKeys} = this._private;
        const del = ii => ii.delete(index);

        this._private.handleChange({
            value: processValue(del),
            meta: processMeta(del),
            keys: processKeys(del)
        });
    };

    insert: Function = (index: number, parcelData: ParcelData) => {
        const {processValue, processMeta, processKeys} = this._private;
        parcelData = SanitiseParcelData(parcelData);

        this._private.handleChange({
            value: processValue(ii => ii.insert(index, parcelData.value)),
            meta: processMeta((ii, kk) => ii.insert(index, parcelData[kk])),
            keys: processKeys((ii) => ii.insert(index, this._private.newKey()))
        });
    };

    push: Function = (parcelData: ParcelData) => {
        const {processValue, processMeta, processKeys} = this._private;
        parcelData = SanitiseParcelData(parcelData);

        this._private.handleChange({
            value: processValue(ii => ii.push(parcelData.value)),
            meta: processMeta((ii, kk) => ii.push(parcelData[kk])),
            keys: processKeys((ii) => ii.push(this._private.newKey()))
        });
    };

    pop: Function = () => {
        const {processValue, processMeta, processKeys} = this._private;
        const pop = ii => ii.pop();

        this._private.handleChange({
            value: processValue(pop),
            meta: processMeta(pop),
            keys: processKeys(pop)
        });
    };

    shift: Function = () => {
        const {processValue, processMeta, processKeys} = this._private;
        const shift = ii => ii.shift();

        this._private.handleChange({
            value: processValue(shift),
            meta: processMeta(shift),
            keys: processKeys(shift)
        });
    };

    size: Function = (): number => {
        return Wrap(this.value()).size;
    };

    swap: Function = (indexA: number, indexB: number) => {
        const {processValue, processMeta, processKeys} = this._private;

        const size = this.size();
        indexA = NumberWrap(indexA, 0, size);
        indexB = NumberWrap(indexB, 0, size);

        const swap = ii => ii
            .set(indexA, ii.get(indexB).done())
            .set(indexB, ii.get(indexA).done());

        this._private.handleChange({
            value: processValue(swap),
            meta: processMeta(swap),
            keys: processKeys(swap)
        });
    };

    swapNext: Function = (index: number) => {
        this.swap(index, index + 1);
    };

    swapPrev: Function = (index: number) => {
        this.swap(index, index - 1);
    };

    unshift: Function = (parcelData: ParcelData) => {
        const {processValue, processMeta, processKeys} = this._private;
        parcelData = SanitiseParcelData(parcelData);

        this._private.handleChange({
            value: processValue(ii => ii.unshift(parcelData.value)),
            meta: processMeta((ii, kk) => ii.unshift(parcelData[kk])),
            keys: processKeys((ii) => ii.unshift(this._private.newKey()))
        });
    };
}
