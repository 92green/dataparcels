// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type ChangeRequest from '../change/ChangeRequest';

// import keyOrIndexToKey from '../parcelData/keyOrIndexToKey';
let keyOrIndexToKey = () => {};
import combine from '../parcelData/combine';

export default class ParcelNode {
    constructor(value: any) {
        this._parcelData = {
            value
        };
    }

    //
    // private variables
    //

    _parent: ?ParcelNode;
    _parcelData: ?ParcelData;
    _key: Key;
    _changeRequest: ?ChangeRequest;

    //
    // private methods
    //

    _prepareChildKeys = () => {
        // prepare child keys only once per parcel instance
        // by preparing them and mutating this.parcelData
        let {data} = this;
        if(!data.child) {
            // this._parcelData = prepareChildKeys()(data);
        }
    }

    _get = (key: Key|Index, notFoundValue: any): ParcelData => {
        this._prepareChildKeys();
        // return parcelGet(key, notFoundValue)(this.data);
    };

    //
    // getters
    //

    // $FlowFixMe - this doesn't have side effects
    get data(): ParcelData {
        if(!this._parcelData) {
            this._parcelData = {
                meta: {},
                ...this._parent._get(this._key)
            };
        }
        return this._parcelData;
    }

    // $FlowFixMe - this doesn't have side effects
    get value(): any {
        return this.data.value;
    }

    // $FlowFixMe - this doesn't have side effects
    get meta(): any {
        return this.data.meta || {};
    }

    // $FlowFixMe - this doesn't have side effects
    get key(): ?Key {
        return this.data.key;
    }

    //
    // methods
    //

    get = (key: Key|Index): ParcelNode => {
        let stringKey: Key = keyOrIndexToKey(key)(this.data);
        let parcelNode = new ParcelNode();
        parcelNode._parcelData = undefined;
        parcelNode._key = stringKey;
        parcelNode._parent = this;
        return parcelNode;
    };

    update = (updater: Function): ParcelNode => {
        let preparedUpdater = combine(updater);
        let parcelNode = new ParcelNode();
        parcelNode._parcelData = preparedUpdater({
            ...this._parcelData,
            changeRequest: this._changeRequest
        });
        return parcelNode;
    };
}
