// @flow
import type {ActionStep} from '../types/Types';
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type Action from './Action';

import shallowEquals from 'unmutable/shallowEquals';

import {ChangeRequestNoPrevDataError} from '../errors/Errors';
import ChangeRequestReducer from '../change/ChangeRequestReducer';
import parcelGet from '../parcelData/get';

export default class ChangeRequest {

    _actions: Action[] = [];
    _prevData: ?ParcelData;
    _nextData: ?ParcelData;
    _originId: ?string = null;
    _originPath: ?string[] = null;
    _revertCallback: ?Function;
    _nextFrameMeta: {[key: string]: any} = {};

    constructor(action: Action|Action[] = []) {
        this._actions = this._actions.concat(action);
    }

    _create = ({actions, nextFrameMeta, prevData}: any): ChangeRequest => {
        // never copy nextData as the cache may be invalid
        let changeRequest = new ChangeRequest();
        changeRequest._actions = actions || this._actions;
        changeRequest._originId = this._originId;
        changeRequest._originPath = this._originPath;
        changeRequest._revertCallback = this._revertCallback;
        changeRequest._nextFrameMeta = nextFrameMeta || this._nextFrameMeta;
        changeRequest._prevData = prevData; // or else this is undefined
        return changeRequest;
    };

    _addStep = (step: ActionStep): ChangeRequest => {
        return this._create({
            actions: this._actions.map(ii => ii._addStep(step))
        });
    };

    _revert = () => {
        this._revertCallback && this._revertCallback(this);
    };

    // $FlowFixMe - this doesn't have side effects
    get nextData(): ?ParcelData {
        let {_nextData} = this;
        if(_nextData) {
            return _nextData;
        }

        this._nextData = ChangeRequestReducer(this)(this.prevData);
        return this._nextData;
    }

    // $FlowFixMe - this doesn't have side effects
    get prevData(): ParcelData {
        if(!this._prevData) {
            throw ChangeRequestNoPrevDataError();
        }
        return this._prevData;
    }

    // $FlowFixMe - this doesn't have side effects
    get actions(): ParcelData {
        return this._actions;
    }

    merge = (other: ChangeRequest): ChangeRequest => {

        let actions = other._actions.reduce((actions, thisAction) => {
            let lastAction = actions.slice(-1)[0];

            let shouldReplace: boolean = lastAction
                && thisAction.type === "set"
                && lastAction.type === "set"
                && thisAction.keyPath.join(".") === lastAction.keyPath.join(".");

            if(shouldReplace) {
                actions = actions.slice(0,-1);
            }
            return actions.concat(thisAction);
        }, this._actions);

        let nextFrameMeta = {
            ...this._nextFrameMeta,
            ...other._nextFrameMeta
        };

        return this._create({
            actions,
            nextFrameMeta
        });
    };

    // $FlowFixMe - this doesn't have side effects
    get originId(): ?string {
        return this._originId;
    }

    // $FlowFixMe - this doesn't have side effects
    get originPath(): ?string[] {
        return this._originPath;
    }

    getDataIn = (keyPath: Array<Key|Index>): {next: *, prev: *} => {
        let getIn = (data: ParcelData) => keyPath.reduce((data, key) => parcelGet(key)(data), data);
        return {
            next: getIn(this.nextData),
            prev: getIn(this.prevData)
        };
    };

    hasDataChanged = (keyPath: Array<Key|Index> = []): boolean => {
        let {next, prev} = this.getDataIn(keyPath);
        return !Object.is(next.value, prev.value)
            || !shallowEquals(next.meta || {})(prev.meta || {});
    };

    hasValueChanged = (keyPath: Array<Key|Index> = []): boolean => {
        let {next, prev} = this.getDataIn(keyPath);
        return !Object.is(next.value, prev.value);
    };
}
