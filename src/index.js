import {Wrap} from 'unmutable'; // TODO swap this out with unmutable-lite

export default function ParcelFactory(value, handleChange) {
    // if(Wrap(value).isIndexed()) {
    //     return new ListParcel(value, handleChange);
    // }
    return new Parcel(value, handleChange);
}

class Parcel {
    constructor(value, handleChange) {
        this._value = value;
        this._onChange = handleChange;

        this.onChange = this.onChange.bind(this);
    }

    value() {
        return this._value;
    }

    onChange(newValue) {
        return this._onChange(newValue);
    }

    modify(valueUpdater, onChangeUpdater = null) {
        return ParcelFactory(
            valueUpdater(this._value),
            onChangeUpdater
                ? (payload) => this._onChange(onChangeUpdater(payload))
                : this._onChange
        );
    }

    get(key, notSetValue = undefined) {
        return ParcelFactory(
            Wrap(this._value).get(key, notSetValue).done(),
            (payload) => {
                this._onChange(
                    Wrap(this._value).set(key, payload).done()
                );
            }
        );
    }

    getIn(keyPath, notSetValue = undefined) {
        return ParcelFactory(
            Wrap(this._value).getIn(keyPath, notSetValue = undefined).done(),
            (payload) => {
                this._onChange(
                    Wrap(this._value).setIn(keyPath, payload).done()
                );
            }
        );
    }

    map(mapper) {
        return Wrap(this._value)
            .map((value, key) => mapper(this.get(key), key, value, this._value))
            .done();
    }

    spread() {
        return {
            value: this._value,
            onChange: this.onChange
        };
    }
}

// class ListParcel extends Parcel {
// }
