// @flow
import type Parcel from '../parcel/Parcel';
import type {Key, Index} from '../types/Types';
import type Action from './Action';

import Reducer from '../change/Reducer';

type ActionUpdater = (actions: Action[]) => Action[];

export default class ChangeRequest {

    _actions: Action[] = [];
    _baseParcel: ?Parcel;
    _meta: * = {};
    _originId: ?string = null;
    _originPath: ?string[] = null;

    constructor(action: Action|Action[] = []) {
        this._actions = this._actions.concat(action);
    }

    _create = ({actions, baseParcel, meta, originId, originPath}: Object): ChangeRequest => {
        let changeRequest = new ChangeRequest();
        changeRequest._actions = actions || this._actions;
        changeRequest._baseParcel = baseParcel || this._baseParcel;
        changeRequest._meta = meta || this._meta;
        changeRequest._originId = originId || this._originId;
        changeRequest._originPath = originPath || this._originPath;
        return changeRequest;
    };

    _unget = (key: Key|Index): ChangeRequest => {
        return this._create({
            actions: this._actions.map(ii => ii._unget(key))
        });
    };

    setBaseParcel = (baseParcel: Parcel): ChangeRequest => {
        return this._create({
            baseParcel
        });
    };

    data = (): * => {
        if(!this._baseParcel) {
            throw new Error(`ChangeRequest data() cannot be called before calling setBaseParcel()`);
        }

        let parcelDataFromRegistry = this
            ._baseParcel
            ._treeshare
            .registry
            .get(this._baseParcel._id.id())
            .raw();

        return Reducer(parcelDataFromRegistry, this._actions);
    };

    value = (): * => {
        return this.data().value;
    };

    meta = (): * => {
        return this.data().meta;
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
        return this
            .updateActions(ii => ii.concat(other.actions()))
            .setChangeRequestMeta(other.changeRequestMeta());
    };

    changeRequestMeta = (): * => {
        return this._meta;
    };

    setChangeRequestMeta = (partialMeta: *): ChangeRequest => {
        return this._create({
            meta: {
                ...this._meta,
                ...partialMeta
            }
        });
    };

    originId = (): ?string => {
        return this._originId;
    };

    originPath = (): ?string[] => {
        return this._originPath;
    };

    toJS = (): Object => {
        return {
            actions: this._actions,
            meta: this._meta,
            originId: this._originId,
            originPath: this._originPath
        };
    };
}
