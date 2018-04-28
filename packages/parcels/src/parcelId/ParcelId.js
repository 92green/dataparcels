// @flow
import type {Key} from '../types/Types';

import last from 'unmutable/lib/last';
import push from 'unmutable/lib/push';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

type ParcelIdData = {
    id: string[],
    path: string[],
    typedPath: string[]
};

const DEFAULT_PARCELID_DATA = {
    id: [],
    path: [],
    typedPath: []
};

export default class ParcelId {
    _id: string[];
    _path: string[];
    _typedPath: string[];

    constructor(parcelIdData: ParcelIdData = DEFAULT_PARCELID_DATA) {
        this._id = parcelIdData.id;
        this._path = parcelIdData.path;
        this._typedPath = parcelIdData.typedPath;
    }

    _create: Function = (data: Object): ParcelId => {
        return new ParcelId(data);
    };

    key: Function = (): Key => {
        if(this._path.length === 0) {
            return "^";
        }
        return last()(this._path);
    };

    id: Function = (): string => {
        if(this._id.length === 0) {
            return "^";
        }
        return this._id.join("/");
    };

    path: Function = (): Array<Key> => {
        return this._path;
    };

    typedPathString: Function = (): string => {
        if(this._typedPath.length === 0) {
            return "^";
        }
        return this._typedPath.join("/");
    };

    push: Function = (key: Key): ParcelId => {
        return pipeWith(
            this.toJS(),
            update('id', push(key)),
            update('path', push(key)),
            update('typedPath', push(`${key}:abcde`)), // TODO types
            this._create
        );
    };

    pushModifier: Function = (modifierTypeId: string): ParcelId => {
        return pipeWith(
            this.toJS(),
            update('id', push(`&${modifierTypeId}&`)),
            this._create
        );
    };

    toJS: Function = (): Object => ({
        id: this._id,
        path: this._path,
        typedPath: this._typedPath
    });
}
