// @flow
import get from 'unmutable/lib/get';
import map from 'unmutable/lib/map';
import size from 'unmutable/lib/size';
import toArray from 'unmutable/lib/toArray';
import unshift from 'unmutable/lib/unshift';
import update from 'unmutable/lib/update';
import overload from 'unmutable/lib/util/overload';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

import ValueParcel from './ValueParcel';
import Action from '../reducer/Action';

import parcelForEach from '../parcelData/forEach';
import parcelGet from '../parcelData/get';
import parcelHas from '../parcelData/has';

export default class CollectionParcel extends ValueParcel {

    //
    // public
    //

    // get methods

    get: Function = (key: Key, notSetValue: * = undefined): ?Parcel => {
        if(!parcelHas(key)(this._parcelData)) {
            return notSetValue;
        }

        const childParcelData: ParcelData = parcelGet(key)(this._parcelData);

        const childHandleChange: Function = (parcelData: ParcelData, actions: Action[]) => {
            pipeWith(
                actions,
                map(pipe(
                    action => action.toJS(),
                    update('keyPath', unshift(key)),
                    action => new Action(action)
                )),
                this.dispatch
            );
        };

        return this._create({
            ...childParcelData,
            handleChange: this._skipReducer(childHandleChange),
            idAppend: get('key', key)(childParcelData)
        });
    };

    getIn: Function = (keyPath: Key[], notSetValue: * = undefined): * => {
        var parcel = this;
        for(let key of keyPath) {
            if(!parcel) {
                return notSetValue;
            }
            parcel = parcel.get(key, notSetValue);
        }
        return parcel;
    };

    toObject: Function = (mapper: Function = ii => ii): Object => {
        let obj = {};

        parcelForEach((parcelData: ParcelData, index: string|number) => {
            let item = this.get(index);
            let mapped = mapper(item, index, this);
            obj[index] = mapped;
        })(this._parcelData);

        return obj;
    };

    toArray: Function = (mapper: Function = ii => ii): Array<*> => {
        return toArray()(this.toObject(mapper));
    };

    size: Function = () => size()(this.value());

    // change methods

    set: Function = overload({
        ["1"]: () => this._setSelf,
        ["2"]: () => (key: Key, value: ParcelValue) => {
            this.get(key).set(value);
        }
    });

    update: Function = overload({
        ["1"]: () => this._updateSelf,
        ["2"]: () => (key: Key, updater: Function) => {
            this.get(key).update(updater);
        }
    });

    setIn = (keyPath: Key[], value: ParcelValue) => {
        this.getIn(keyPath).set(value);
    };

    updateIn = (keyPath: Key[], updater: Function) => {
        this.getIn(keyPath).update(updater);
    };
}
