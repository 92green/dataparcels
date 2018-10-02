// @flow
import type {Key} from '../types/Types';

import has from 'unmutable/lib/has';
import set from 'unmutable/lib/set';
import unshift from 'unmutable/lib/unshift';

type ActionData = {
    type?: string,
    payload?: Object,
    keyPath?: Array<Key>
};

type CreateActionData = {
    type?: string,
    payload?: Object,
    keyPath?: Array<Key>,
    keyPathModifiers?: Array<KeyPathModifiers>
};

type KeyPathModifiers = {
    key?: Key,
    pre?: Function,
    post?: Function
};

export default class Action {
    type: string = "";
    payload: Object = {};
    keyPath: Array<Key> = [];
    keyPathModifiers: Array<KeyPathModifiers> = [];

    constructor({type, payload, keyPath}: ActionData = {}) {
        this.type = type || this.type;
        this.payload = payload || this.payload;
        this.keyPath = keyPath || this.keyPath;

        if(keyPath) {
            this.keyPathModifiers = keyPath.map(key => ({key}));
        }
    }

    _create = (create: CreateActionData): Action => {
        return new Action({
            ...this.toJS(),
            ...create
        });
    };

    _updateFirstKeyPathModifier = (obj: *, keyPathModifiers: Array<KeyPathModifiers>): Array<KeyPathModifiers> => {
        let first = keyPathModifiers[0];
        let fn = (!first || !has("key")(first))
            ? unshift(obj)
            : set(0, {...obj, ...first});

        return fn(keyPathModifiers);
    };

    _unget = (key: Key): Action => {
        return this._create({
            keyPath: unshift(key)(this.keyPath),
            keyPathModifiers: this._updateFirstKeyPathModifier({key}, this.keyPathModifiers)
        });
    };

    _addPre = (pre: Function) => {
        return this._create({
            keyPathModifiers: this._updateFirstKeyPathModifier({pre}, this.keyPathModifiers)
        });
    };

    _addPost = (post: Function) => {
        return this._create({
            keyPathModifiers: this._updateFirstKeyPathModifier({post}, this.keyPathModifiers)
        });
    };

    shouldBeSynchronous = (): boolean => {
        return this.type === "ping";
    };

    isValueAction = (): boolean => {
        return this.type !== "ping" && this.type !== "setMeta";
    };

    isMetaAction = (): boolean => {
        return this.type === "setMeta";
    };

    toJS = (): ActionData => {
        let {type, payload, keyPath, keyPathModifiers} = this;
        return {type, payload, keyPath, keyPathModifiers};
    };
}
