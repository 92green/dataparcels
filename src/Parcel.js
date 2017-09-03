// @flow
import {Wrap} from 'unmutable';
import ParcelFactory from './ParcelFactory';
import recursiveFilter from './util/recursiveFilter';
import unwrapParcel from './util/unwrapParcel';

export default class Parcel {
    _privateData: Object;
    _privateMethods: Object;

    constructor(parcelData: ParcelData, handleChange: HandleChange) {
        const _handleChange: Function = (newData: ParcelData, action: Action) => {

            // remove meta object if it is empty
            if(newData.meta && Wrap(newData.meta).isEmpty()) {
                newData = Wrap(newData).delete('meta').done();
            }

            // remove keys object / map if it is not defined
            const isDefined: Function = ii => typeof ii !== "undefined";
            if(!isDefined(recursiveFilter(newData.keys, isDefined, undefined)) && Wrap(newData.keys).isKeyed()) {
                newData = Wrap(newData).delete('keys').done();
            }

            handleChange(newData, action);
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
            return updater(Wrap(this._privateData.keys || {})).done();
        };

        this._privateData = parcelData;

        this._privateMethods = {
            handleChange: _handleChange,
            onChange,
            metaChange,
            processValue,
            processMeta,
            processKeys
        };
    }

    value: Function = (): * => {
        return this._privateData.value;
    };

    meta: Function = (key: ?string): * => {
        const {meta} = this._privateData;
        if(!key) {
            return meta;
        }
        return meta
            ? meta[key]
            : null;
    };

    key: Function = (): number => {
        return this._privateData.keys.key;
    };

    onChange: Function = (newValue: *) => {
        this._privateMethods.onChange(newValue);
    };

    onChangeDOM: Function = (event: Object) => {
        this.onChange(event.target.value);
    };

    metaChange: Function = (key: ?string): Function => {
        const {metaChange} = this._privateMethods;
        if(!key) {
            return metaChange;
        }
        return (newMeta) => metaChange(
            Wrap(this.meta()).set(key, newMeta).done()
        );
    };

    modifyValue: Function = (valueUpdater: ValueUpdater): Parcel => {
        const {processValue, processMeta, processKeys} = this._privateMethods;
        return ParcelFactory(
            {
                value: processValue(ii => Wrap(valueUpdater(ii.done()))),
                meta: processMeta(ii => Wrap(valueUpdater(ii.done()))),
                keys: processKeys(ii => ii)
            },
            this._privateMethods.handleChange
        );
    };

    modifyChange: Function = (onChangeUpdater: OnChangeUpdater): Parcel => {
        const {processValue, processMeta, processKeys} = this._privateMethods;
        return ParcelFactory(
            {
                value: processValue(ii => ii),
                meta: processMeta(ii => ii),
                keys: processKeys(ii => ii)
            },
            (newData: ParcelData) => {
                this._privateMethods.handleChange({
                    value: processValue(ii => Wrap(onChangeUpdater(newData.value))),
                    meta: processMeta((ii, kk) => Wrap(onChangeUpdater(newData.meta[kk]))),
                    keys: processKeys(ii => ii)
                });
            }
        );
    };

    get: Function = (key: string, notSetValue: * = undefined): Parcel => {
        const {processValue, processMeta, processKeys} = this._privateMethods;
        return ParcelFactory(
            {
                value: processValue(ii => ii.get(key, notSetValue)),
                meta: processMeta(ii => ii.get(key)),
                keys: processKeys(ii => ii.get(key))
            },
            ({value, meta, keys}: ParcelData, action: Action) => {

                if(action) {
                    // TODO do this immutably
                    action.payload.keyPath = [key, ...action.payload.keyPath];
                } else {
                    action = {
                        type: "set",
                        payload: {
                            value,
                            meta,
                            keyPath: [key]
                        }
                    };
                }

                const newData = {
                    value: processValue(ii => ii.set(key, value)),
                    meta: processMeta((ii, kk) => ii.set(key, meta[kk])),
                    keys: processKeys(ii => ii.set(key, keys))
                };

                this._privateMethods.handleChange(newData, action);
            }
        );
    };

    getIn: Function = (keyPath: Array<string>, notSetValue: * = undefined): Parcel => {
        const {processValue, processMeta, processKeys} = this._privateMethods;
        const keysKeyPath = Wrap(keyPath).interpose("children").done();
        return ParcelFactory(
            {
                value: processValue(ii => ii.getIn(keyPath, notSetValue)),
                meta: processMeta(ii => ii.getIn(keyPath)),
                keys: processKeys(ii => ii.getIn(keysKeyPath))
            },
            ({value, meta, keys}: ParcelData, action: Action) => {

                if(action) {
                    // TODO do this immutably
                    action.payload.keyPath = [...keyPath, ...action.payload.keyPath];
                } else {
                    action = {
                        type: "set",
                        payload: {
                            value,
                            meta,
                            keyPath
                        }
                    };
                }

                const newData = {
                    value: processValue(ii => ii.setIn(keyPath, value)),
                    meta: processMeta((ii, kk) => ii.setIn(keyPath, meta[kk])),
                    keys: processKeys(ii => ii.setIn(keysKeyPath, keys))
                };

                this._privateMethods.handleChange(newData, action);
            }
        );
    };

    map: Function = (mapper: Mapper): Parcel => {
        const {processValue} = this._privateMethods;
        return ParcelFactory(
            {
                value: processValue((ii: *): * => { // TODO -these should be typed as UnmutableWrappers
                    return ii.map((value, key) => unwrapParcel(
                        mapper(this.get(key), key))
                    );
                }),
                meta: this.meta(),
                keys: this._privateData.keys
            },
            this._privateMethods.handleChange
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
