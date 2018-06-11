// @flow
import type {
    Key,
    ParcelData
} from '../types/Types';
import type Action from './Action';
import Reducer from '../change/Reducer';

type ActionUpdater = (actions: Action[]) => Action[];

export default class ChangeRequest {

    _actions: Action[] = [];
    _base: ?ParcelData;
    _meta: * = {};
    _originId: ?string;
    _originPath: ?string[];

    constructor(action: Action|Action[] = []) {
        this._actions = this._actions.concat(action);
    }

    _create = ({actions, base, meta, originId, originPath}: *): ChangeRequest => {
        let changeRequest = new ChangeRequest();
        changeRequest._actions = actions || this._actions;
        changeRequest._base = base || this._base;
        changeRequest._meta = meta || this._meta;
        changeRequest._originId = originId || this._originId;
        changeRequest._originPath = originPath || this._originPath;
        return changeRequest;
    };

    _unget = (key: Key): ChangeRequest => {
        return this._create({
            actions: this._actions.map(ii => ii._unget(key))
        });
    };

    setBase = (base: ParcelData): ChangeRequest => {
        return this._create({
            base
        });
    };

    data = (): * => {
        if(!this._base) {
            throw new Error(`ChangeRequest data() cannot be called before calling setBase()`);
        }
        return Reducer(this._base, this._actions);
    };

    actions = (): Action[] => {
        return this._actions;
    };

    updateActions = (updater: ActionUpdater): ChangeRequest => {
        return this._create({
            actions: updater(this._actions)
        });
    };

    merge = (other: ChangeRequest): ChangeRequest => {
        return this.updateActions(ii => ii.concat(other.actions()));
    };

    meta = (): * => {
        return this._meta;
    };

    setMeta = (partialMeta: *): ChangeRequest => {
        return this._create({
            meta: {
                ...this._meta,
                ...partialMeta
            }
        });
    };
}
