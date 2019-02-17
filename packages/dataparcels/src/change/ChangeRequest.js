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

import pipe from 'unmutable/lib/util/pipe';

type ActionUpdater = (actions: Action[]) => Action[];

export default class ChangeRequest {

    _actions: Action[] = [];
    _prevData: ?ParcelData;
    _nextData: ?ParcelData;
    _meta: * = {};
    _originId: ?string = null;
    _originPath: ?string[] = null;

    constructor(action: Action|Action[] = []) {
        this._actions = this._actions.concat(action);
    }

    _create = (changeRequestData: Object): ChangeRequest => {

        changeRequestData = {
            actions: this._actions,
            prevData: this._prevData,
            nextData: this._nextData,
            meta: this._meta,
            originId: this._originId,
            originPath: this._originPath,
            ...changeRequestData
        };

        let changeRequest = new ChangeRequest();
        changeRequest._actions = changeRequestData.actions;
        changeRequest._prevData = changeRequestData.prevData;
        changeRequest._nextData = changeRequestData.nextData;
        changeRequest._meta = changeRequestData.meta;
        changeRequest._originId = changeRequestData.originId;
        changeRequest._originPath = changeRequestData.originPath;
        return changeRequest;
    };

    _addStep = (step: ActionStep): ChangeRequest => {
        return this._create({
            actions: this._actions.map(ii => ii._addStep(step)),
            nextData: undefined,
            prevData: undefined
        });
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

    actions = (): Action[] => {
        return this._actions;
    };

    updateActions = (updater: ActionUpdater): ChangeRequest => {
        return this._create({
            actions: updater(this._actions),
            nextData: undefined,
            prevData: undefined
        });
    };

    merge = (other: ChangeRequest): ChangeRequest => {
        return this
            .updateActions(ii => ii.concat(other.actions()))
            .setChangeRequestMeta(other.changeRequestMeta);
    };

    // $FlowFixMe - this doesn't have side effects
    get changeRequestMeta(): * {
        return this._meta;
    }

    // $FlowFixMe - this doesn't have side effects
    set changeRequestMeta(value: *) {
        throw ReadOnlyError();
    }

    setChangeRequestMeta = (partialMeta: *): ChangeRequest => {
        return this._create({
            meta: {
                ...this._meta,
                ...partialMeta
            }
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
        return next.value !== prev.value;
    };

    toJS = (): Object => {
        return {
            actions: this._actions.map(action => action.toJS()),
            meta: this._meta,
            originId: this._originId,
            originPath: this._originPath
        };
    };

    toConsole = () => {
        console.log(this.toJS()); // eslint-disable-line
    };
}
