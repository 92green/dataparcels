// @flow
import type {
    Key,
    ParcelData
} from '../types/Types';
import type Action from './Action';

type ActionUpdater = (actions: Action[]) => Action[];

export default class ChangeRequest {

    _actions: Action[] = [];
    _meta: * = {};
    _parcelData: ?ParcelData;
    _originId: ?string;
    _originPath: ?string[];

    constructor(action: Action|Action[] = []) {
        this._actions.concat(action);
    }

    _create = ({actions, meta}: *): ChangeRequest => {
        let changeRequest = new ChangeRequest();
        changeRequest._actions = actions || this._actions;
        changeRequest._meta = meta || this._meta;
        return changeRequest;
    };

    _unget = (key: Key): ChangeRequest => {
        return this._create({
            actions: this._actions.map(ii => ii._unget(key))
        });
    };

    data = (): * => {
        return null;
    };

    actions = (): Action[] => {
        return this._actions;
    };

    updateActions = (updater: ActionUpdater): ChangeRequest => {
        return this._create({
            actions: updater(this._actions)
        });
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
