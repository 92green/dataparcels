// @flow
import {Wrap} from 'unmutable'; // TODO swap this out with unmutable-lite

type ParcelData = {value: *, meta: Object};
type ModifyValue = (value: *) => *;
type OnChangeUpdater = (payload: *) => *;
type Mapper = (parcel: Parcel, key: string, value: *, iter: *) => *;

function SanitiseParcelData(data: ParcelData): ParcelData {
    if(typeof data !== "object" || !data.hasOwnProperty('value')) {
        console.warn(`Parcel must be passed an object with "value" (any type) and optional "meta" object`);
        return {
            value: null
        };
    }

    var value = null;
    var meta = null;

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
        value,
        meta
    };
}

export default function ParcelFactory(data: ParcelData, handleChange: Function): Parcel {
    data = SanitiseParcelData(data);
    if(Wrap(data.value).isIndexed()) {
        return new ListParcel(data, handleChange);
    }
    return new Parcel(data, handleChange);
}

class Parcel {
    constructor(data: ParcelData, handleChange: Function) {
        this._data = data; //Parcel.unwrap(value);
        this._handleChange = (newData: ParcelData) => {
            // remove meta object if it is empty
            if(newData.meta && Wrap(newData.meta).size === 0) {
                newData = Wrap(newData).delete('meta').done();
            }
            handleChange(newData);
        };

        this._onChange = (newValue: *) => {
            handleChange({
                value: newValue,
                meta: data.meta
            });
        };
        this._metaChange = (newMeta: Object) => {
            handleChange({
                value: data.value,
                meta: newMeta
            });
        };

        this.onChange = this.onChange.bind(this);
        this.onChangeDOM = this.onChangeDOM.bind(this);
    }

    static unwrap(item: *): * {
        return typeof item == "object" && item instanceof Parcel
            ? item.value()
            : item;
    }

    value(): * {
        return this._data.value;
    }

    meta(key: ?string): * {
        if(!key) {
            return this._data.meta || {};
        }
        return this._data.meta
            ? this._data.meta[key]
            : null;
    }

    onChange(newValue: *) {
        this._onChange(newValue);
    }

    onChangeDOM(event: Object) {
        this._onChange(event.target.value);
    }

    metaChange(key: ?string): Function {
        if(!key) {
            return this._metaChange;
        }
        return (newMeta) => this._metaChange(
            Wrap(this.meta()).set(key, newMeta).done()
        );
    }

    // modifyValue(valueUpdater: ModifyValue): Parcel {
    //     return ParcelFactory(
    //         valueUpdater(this._value),
    //         this._handleChange
    //     );
    // }

    // modifyChange(onChangeUpdater: OnChangeUpdater): Parcel {
    //     return ParcelFactory(
    //         this._value,
    //         onChangeUpdater
    //             ? (payload) => this._handleChange(onChangeUpdater(payload))
    //             : this._handleChange
    //     );
    // }

    get(key: string, notSetValue: * = undefined): Parcel {
        return ParcelFactory(
            {
                value: Wrap(this.value())
                    .get(key, notSetValue)
                    .done(),

                meta: Wrap(this.meta())
                    .map(ii => Wrap(ii).get(key, {}).done())
                    .done()
            },
            (newData: ParcelData) => {
                this._handleChange({
                    value: Wrap(this.value())
                        .set(key, newData.value)
                        .done(),

                    meta: Wrap(this.meta())
                        .map((ii, kk) => Wrap(ii).set(key, newData.meta[kk]).done())
                        .done()
                });
            }
        );
    }

    // getIn(keyPath: Array<string>|List<string>, notSetValue: * = undefined): Parcel {
    //     return ParcelFactory(
    //         Wrap(this._value).getIn(keyPath, notSetValue).done(),
    //         (payload: *) => {
    //             this._handleChange(
    //                 Wrap(this._value).setIn(keyPath, payload).done()
    //             );
    //         }
    //     );
    // }

    // map(mapper: Mapper): Parcel {
    //     return ParcelFactory(
    //         Wrap(this._value)
    //             .map((value, key) => Parcel.unwrap(
    //                 mapper(this.get(key), key, value, this._value))
    //             )
    //             .done(),
    //         this._handleChange
    //     );
    // }

    spread(): Object {
        return {
            value: this.value(),
            onChange: this.onChange
        };
    }

    spreadDOM(): Object {
        return {
            value: this.value(),
            onChange: this.onChangeDOM
        };
    }
}

class ListParcel extends Parcel {
}
