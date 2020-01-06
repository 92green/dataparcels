// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {ParcelMeta} from '../types/Types';

import isParentValue from '../parcelData/isParentValue';
import isIndexedValue from '../parcelData/isIndexedValue';
import keyOrIndexToKey from '../parcelData/keyOrIndexToKey';
import prepareChildKeys from '../parcelData/prepareChildKeys';
import parcelSetSelf from '../parcelData/setSelf';
import parcelGet from '../parcelData/get';
import setMeta from '../parcelData/setMeta';
import updateChild from '../parcelData/updateChild';
import updateChildKeys from '../parcelData/updateChildKeys';

import map from 'unmutable/map';
import pipeWith from 'unmutable/pipeWith';
import shallowToJS from 'unmutable/shallowToJS';

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

    //
    // private methods
    //

    _prepareChildKeys = () => {
        // prepare child keys only once per parcel instance
        // by preparing them and mutating this.parcelData
        let {data} = this;
        if(!data.child) {
            this._parcelData = prepareChildKeys()(data);
        }
    }

    _get = (key: Key|Index, notFoundValue: any): ParcelData => {
        this._prepareChildKeys();
        return parcelGet(key, notFoundValue)(this.data);
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
        let {data, value} = this;
        if(isParentValue(value)) {
            this._prepareChildKeys();
            value = pipeWith(
                value,
                map((value, key) => this.get(key))
            );
        }

        let updated: any = updater(value);

        let parcelNode = new ParcelNode();
        if(!isParentValue(updated)) {
            parcelNode._parcelData = parcelSetSelf(updated)(data);
            return parcelNode;
        }

        updated = pipeWith(
            updated,
            map((maybeNode: any) => maybeNode instanceof ParcelNode
                ? maybeNode
                : new ParcelNode(maybeNode)
            )
        );

        let newValue = map(node => node.value)(updated);

        let hasNewNode = false;
        let keyMap = {};

        let newChild = pipeWith(
            updated,
            shallowToJS(),
            map(node => {
                let {child, meta, key} = node.data;

                let keyExists = keyMap[key];
                keyMap[key] = true;
                if(keyExists || node._parent !== this) {
                    hasNewNode = true;
                    key = undefined;
                }

                return {child, meta, key};
            })
        );

        let newParcelData: ParcelData = {
            ...data,
            value: newValue,
            child: newChild
        };

        let typeChanged = () => isIndexedValue(value) !== isIndexedValue(updated);

        if(hasNewNode || typeChanged()) {
            newParcelData = pipeWith(
                newParcelData,
                updateChild(),
                updateChildKeys(data.child)
            );
        }

        parcelNode._parcelData = newParcelData;
        return parcelNode;
    };

    setMeta = (meta: ParcelMeta): ParcelNode => {
        let parcelNode = new ParcelNode();
        parcelNode._parcelData = setMeta(meta)(this.data);
        return parcelNode;
    };
}
