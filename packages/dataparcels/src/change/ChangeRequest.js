// @flow
import type {ActionStep} from '../types/Types';
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type Action from './Action';

import {ReadOnlyError} from '../errors/Errors';
import {ChangeRequestNoPrevDataError} from '../errors/Errors';
import ChangeRequestReducer from '../change/ChangeRequestReducer';
import parcelGet from '../parcelData/get';

import butLast from 'unmutable/butLast';
import identity from 'unmutable/identity';
import last from 'unmutable/last';
import pipe from 'unmutable/pipe';
import pipeWith from 'unmutable/pipeWith';
import push from 'unmutable/push';

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

    _create = (changeRequestData: Object): ChangeRequest => {

        changeRequestData = {
            actions: this._actions,
            prevData: this._prevData,
            nextData: this._nextData,
            originId: this._originId,
            originPath: this._originPath,
            revertCallback: this._revertCallback,
            nextFrameMeta: this._nextFrameMeta,
            ...changeRequestData
        };

        let changeRequest = new ChangeRequest();
        changeRequest._actions = changeRequestData.actions;
        changeRequest._prevData = changeRequestData.prevData;
        changeRequest._nextData = changeRequestData.nextData;
        changeRequest._originId = changeRequestData.originId;
        changeRequest._originPath = changeRequestData.originPath;
        changeRequest._revertCallback = changeRequestData.revertCallback;
        changeRequest._nextFrameMeta = changeRequestData.nextFrameMeta;
        return changeRequest;
    };

    _addStep = (step: ActionStep): ChangeRequest => {
        return this._create({
            actions: this._actions.map(ii => ii._addStep(step)),
            nextData: undefined,
            prevData: undefined
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
    set nextData(value: *) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get prevData(): ParcelData {
        if(!this._prevData) {
            throw ChangeRequestNoPrevDataError();
        }
        return this._prevData;
    }

    // $FlowFixMe - this doesn't have side effects
    set prevData(value: *) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get actions(): ParcelData {
        return this._actions;
    }

    // $FlowFixMe - this doesn't have side effects
    set actions(value: *) {
        throw ReadOnlyError();
    }

    merge = (other: ChangeRequest): ChangeRequest => {

        let actions = other._actions.reduce((actions, thisAction) => {
            let lastAction = last()(actions);

            let keyPathEquals = () => thisAction.keyPath.join(".") === lastAction.keyPath.join(".");

            let shouldReplace: boolean = lastAction
                && thisAction.type === "set"
                && lastAction.type === "set"
                && keyPathEquals();

            return pipeWith(
                actions,
                shouldReplace ? butLast() : identity(),
                push(thisAction)
            );
        }, this._actions);

        let nextFrameMeta = {
            ...this._nextFrameMeta,
            ...other._nextFrameMeta
        };

        return this._create({
            actions,
            nextFrameMeta,
            nextData: undefined,
            prevData: undefined
        });
    };

    // $FlowFixMe - this doesn't have side effects
    get originId(): ?string {
        return this._originId;
    }

    // $FlowFixMe - this doesn't have side effects
    set originId(value: *) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get originPath(): ?string[] {
        return this._originPath;
    }

    // $FlowFixMe - this doesn't have side effects
    set originPath(value: *) {
        throw ReadOnlyError();
    }

    getDataIn = (keyPath: Array<Key|Index>): {next: *, prev: *} => {
        let getIn = pipe(
            ...keyPath.map(key => parcelGet(key))
        );

        return {
            next: getIn(this.nextData),
            prev: getIn(this.prevData)
        };
    };

    hasValueChanged = (keyPath: Array<Key|Index> = []): boolean => {
        let {next, prev} = this.getDataIn(keyPath);
        return !Object.is(next.value, prev.value);
    };
}
