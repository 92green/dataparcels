// @flow
import {Wrap} from 'unmutable'; // TODO swap this out with unmutable-lite

type ParcelData = {
    value: *,
    meta: Object
};

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

    var value = null;
    var meta = {};

    if(data.hasOwnProperty('value')) {
        value = data.value;
    }
    if(data.hasOwnProperty('meta')) {
        if(typeof data.meta !== "object") {
            console.warn(`Parcel meta must be an object`);
        } else {
            meta = data.meta;
        }
    }

    return {
        value: UnwrapParcel(value),
        meta
    };
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
            if(newData.meta && Wrap(newData.meta).size === 0) {
                newData = Wrap(newData).delete('meta').done();
            }
            handleChange(newData);
        };

        const onChange: Function = (newValue: *) => {
            handleChange({
                value: newValue,
                meta: parcelData.meta
            });
        };

        const metaChange: Function = (newMeta: Object) => {
            handleChange({
                value: parcelData.value,
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

        this._private = {
            ...parcelData,
            handleChange: _handleChange,
            onChange,
            metaChange,
            processValue,
            processMeta
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

    // modifyValue(valueUpdater: ModifyValue): Parcel {
    //     return ParcelFactory(
    //         valueUpdater(this._value),
    //         this._private.handleChange
    //     );
    // }

    // modifyChange(onChangeUpdater: OnChangeUpdater): Parcel {
    //     return ParcelFactory(
    //         this._value,
    //         onChangeUpdater
    //             ? (payload) => this._private.handleChange(onChangeUpdater(payload))
    //             : this._private.handleChange
    //     );
    // }

    get: Function = (key: string, notSetValue: * = undefined): Parcel => {
        const {processValue, processMeta} = this._private;
        return ParcelFactory(
            {
                value: processValue(ii => ii.get(key, notSetValue)),
                meta: processMeta(ii => ii.get(key))
            },
            (newData: ParcelData) => {
                this._private.handleChange({
                    value: processValue(ii => ii.set(key, newData.value)),
                    meta: processMeta((ii, kk) => ii.set(key, newData.meta[kk]))
                });
            }
        );
    };

    getIn: Function = (keyPath: Array<string>, notSetValue: * = undefined): Parcel => {
        const {processValue, processMeta} = this._private;
        return ParcelFactory(
            {
                value: processValue(ii => ii.getIn(keyPath, notSetValue)),
                meta: processMeta(ii => ii.getIn(keyPath))
            },
            (newData: ParcelData) => {
                this._private.handleChange({
                    value: processValue(ii => ii.setIn(keyPath, newData.value)),
                    meta: processMeta((ii, kk) => ii.setIn(keyPath, newData.meta[kk]))
                });
            }
        );
    };

    key: Function = (): number => {
        return this.meta('listKeys');
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
                meta: this.meta()
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

function NextListKey(listKeys: Array<number>): number {
    if(listKeys.length === 0) {
        return 0;
    }
    return Math.max(...listKeys) + 1;
}

function NumberWrap(val: number, min: number, max: number): number {
    var range = max - min;
    val = (val - min) % range;
    return val < 0 ? val + range : val;
}

class ListParcel extends Parcel {
    constructor(parcelData: ParcelData, handleChange: Function) {
        var {value, meta} = parcelData;
        var listKeys = meta.listKeys || [];
        var nextKey = NextListKey(listKeys) - 1;

        // add list keys for each indexed item
        // from meta, or if that doesnt exist generate new ones
        listKeys = Wrap(value)
            .map((ii: *, kk: number): number => {
                if(typeof listKeys[kk] === "number") {
                    return listKeys[kk];
                }
                nextKey++;
                return nextKey;
            })
            .done();

        super(
            {
                value,
                meta: {
                    ...meta,
                    listKeys
                }
            },
            handleChange
        );

        this._private = {
            ...this._private,
            metaWithListKey: (parcelData: ParcelData): Object => {
                return {
                    ...parcelData.meta,
                    listKeys: NextListKey(this.meta('listKeys'))
                };
            }
        };
    }

    delete: Function = (index: number) => {
        const {processValue, processMeta} = this._private;
        const del = ii => ii.delete(index);

        this._private.handleChange({
            value: processValue(del),
            meta: processMeta(del)
        });
    };

    insert: Function = (index: number, parcelData: ParcelData) => {
        const {processValue, processMeta} = this._private;
        parcelData = SanitiseParcelData(parcelData);

        this._private.handleChange({
            value: processValue(ii => ii.insert(index, parcelData.value)),
            meta: processMeta((ii, kk) => ii.insert(index, this._private.metaWithListKey(parcelData)[kk]))
        });
    };

    push: Function = (parcelData: ParcelData) => {
        const {processValue, processMeta} = this._private;
        parcelData = SanitiseParcelData(parcelData);

        this._private.handleChange({
            value: processValue(ii => ii.push(parcelData.value)),
            meta: processMeta((ii, kk) => ii.push(this._private.metaWithListKey(parcelData)[kk]))
        });
    };

    pop: Function = () => {
        const {processValue, processMeta} = this._private;
        const pop = ii => ii.pop();

        this._private.handleChange({
            value: processValue(pop),
            meta: processMeta(pop)
        });
    };

    shift: Function = () => {
        const {processValue, processMeta} = this._private;
        const shift = ii => ii.shift();

        this._private.handleChange({
            value: processValue(shift),
            meta: processMeta(shift)
        });
    };

    size: Function = (): number => {
        return Wrap(this.value()).size;
    };

    swap: Function = (indexA: number, indexB: number) => {
        const {processValue, processMeta} = this._private;

        const size = this.size();
        indexA = NumberWrap(indexA, 0, size);
        indexB = NumberWrap(indexB, 0, size);

        const swap = ii => ii
            .set(indexA, ii.get(indexB).done())
            .set(indexB, ii.get(indexA).done());

        this._private.handleChange({
            value: processValue(swap),
            meta: processMeta(swap)
        });
    };

    swapNext: Function = (index: number) => {
        this.swap(index, index + 1);
    };

    swapPrev: Function = (index: number) => {
        this.swap(index, index - 1);
    };

    unshift: Function = (parcelData: ParcelData) => {
        const {processValue, processMeta} = this._private;
        parcelData = SanitiseParcelData(parcelData);

        this._private.handleChange({
            value: processValue(ii => ii.unshift(parcelData.value)),
            meta: processMeta((ii, kk) => ii.unshift(this._private.metaWithListKey(parcelData)[kk]))
        });
    };
}
