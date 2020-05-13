// @flow
import type {ActionStep} from '../types/Types';
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';

import shallowEquals from 'unmutable/shallowEquals';

import Action from './Action';
import ActionReducer from '../change/ActionReducer';
import parcelGet from '../parcelData/get';

export default class ChangeRequest {

    _actions: Action[] = [];
    _prevData: ?ParcelData;
    _nextData: ?ParcelData;
    _originId: ?string = null;
    _originPath: ?string[] = null;

    constructor(action: Action|Action[] = []) {
        this._actions = this._actions.concat(action);
    }

    _create = ({actions, prevData}: any): ChangeRequest => {
        // never copy nextData as the cache may be invalid
        let changeRequest = new ChangeRequest();
        changeRequest._actions = actions || this._actions;
        changeRequest._originId = this._originId;
        changeRequest._originPath = this._originPath;
        changeRequest._prevData = prevData; // or else this is undefined
        return changeRequest;
    };

    _addStep = (step: ActionStep): ChangeRequest => {
        return this._create({
            actions: this._actions.map(ii => ii._addStep(step))
        });
    };

    // $FlowFixMe - this doesn't have side effects
    get nextData(): ?ParcelData {
        let {_nextData} = this;
        if(_nextData) {
            return _nextData;
        }

        this._nextData = ActionReducer(this._actions)(this.prevData);
        return this._nextData;
    }

    // $FlowFixMe - this doesn't have side effects
    get prevData(): ParcelData {
        return this._prevData;
    }

    // $FlowFixMe - this doesn't have side effects
    get actions(): ParcelData {
        return this._actions;
    }

    static squash(others: ChangeRequest[]): ChangeRequest {
        if(others.length === 0) {
            return new ChangeRequest();
        }

        let merged = others.reduce((prev, next) => prev.merge(next));

        let changeRequest = new ChangeRequest(
            new Action({
                type: 'batch',
                payload: merged.actions
            })
        );

        return changeRequest;
    }

    merge = (other: ChangeRequest): ChangeRequest => {
        return this._create({
            actions: this._actions.concat(other._actions)
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
