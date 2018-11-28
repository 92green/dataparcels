// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';

import unshift from 'unmutable/lib/unshift';
import update from 'unmutable/lib/update';

import ActionKeyPathModifier from './ActionKeyPathModifier';

type ActionData = {
    type?: string,
    payload?: Object,
    keyPath?: Array<Key|Index>,
    keyPathModifiers?: Array<ActionKeyPathModifier>
};

type CreateActionData = {
    type?: string,
    payload?: Object,
    keyPath?: Array<Key|Index>,
    keyPathModifiers?: Array<ActionKeyPathModifier>
};

export default class Action {
    type: string = "";
    payload: Object = {};
    keyPath: Array<Key|Index> = [];
    keyPathModifiers: Array<ActionKeyPathModifier>;

    constructor({type, payload, keyPath, keyPathModifiers}: ActionData = {}) {

        if(keyPathModifiers) {
            this.keyPathModifiers = keyPathModifiers;
        } else if(!this.keyPathModifiers && keyPath) {
            this.keyPathModifiers = keyPath.map(key => new ActionKeyPathModifier({key}));
        } else {
            this.keyPathModifiers = [];
        }

        this.type = type || this.type;
        this.payload = payload || this.payload;
        this.keyPath = keyPath || this.keyPath;
    }

    _create = (create: CreateActionData): Action => {
        return new Action({
            ...this.toJS(),
            ...create
        });
    };

    _add = (updater: Function): Action => {
        let fn = this.keyPathModifiers.length === 0
            ? unshift(updater(new ActionKeyPathModifier()))
            : update(0, updater);

        return this._create({
            keyPathModifiers: fn(this.keyPathModifiers)
        });
    };

    _unget = (key: Key): Action => {
        return this._create({
            keyPathModifiers: unshift(new ActionKeyPathModifier()._addKey(key))(this.keyPathModifiers),
            keyPath: unshift(key)(this.keyPath)
        });
    };

    _addPre = (pre: Function): Action => {
        return this._add(_ => _._addPre(pre));
    };

    _addPost = (post: Function): Action => {
        return this._add(_ => _._addPost(post));
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
