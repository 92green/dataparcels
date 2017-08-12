import {Wrap} from 'unmutable'; // TODO swap this out with unmutable-lite

export default class Parcel {
    constructor(value, handleChange) {
        this.value = value;
        this.onChange = handleChange;
    }

    get(key) {
        return new Parcel(
            Wrap(this.value).get(key).done(),
            (payload) => {
                this.onChange(
                    Wrap(this.value).set(key, payload).done()
                );
            }
        );
    }

    getIn(keyPath) {
        return new Parcel(
            Wrap(this.value).getIn(keyPath).done(),
            (payload) => {
                this.onChange(
                    Wrap(this.value).setIn(keyPath, payload).done()
                );
            }
        );
    }

    spread() {
        return {
            value: this.value,
            onChange: this.onChange
        };
    }
}
