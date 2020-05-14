// @flow
import type {Key} from '../types/Types';
import type {Type} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {ParcelMapper} from '../types/Types';
import type {ParcelMeta} from '../types/Types';
import type {ParcelUpdater} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';

import ChangeRequest from '../change/ChangeRequest';
import ActionReducer from '../change/ActionReducer';
import Action from '../change/Action';
import combine from '../combine';
import TypeSet from '../typeHandlers/TypeSet';

import pipeWith from 'unmutable/lib/util/pipeWith';
import HashString from '../util/HashString';

type Config = {
    value?: any,
    meta?: {[key: string]: any},
    handleChange?: HandleChange,
    types?: (types: Type[]) => Type[],
    fromSelf?: boolean
};

type TreeShare = {
    registry: {[id: string]: Parcel},
    effectRegistry: {[effectId: string]: boolean}
};

type HandleChange = (parcel: Parcel, changeRequest: ChangeRequest) => void;

type UpdateChangeRequestOnDispatch = (changeRequest: ChangeRequest) => ChangeRequest;

const doNothing = (ii: any): any => ii;
const escapeKey = (key: string): string => key.replace(/([^\w])/g, "%$1");

export default class Parcel {

    //
    // private member variables
    //

    _childParcelCache: Map = new Map();
    _childProperties: {[key: string]: any} = {};
    _childPropertiesPrecomputed: {[key: string]: any} = {};
    _dispatchId: string = '';
    _handleChange: ?HandleChange;
    _rawId: string[] = ['^'];
    _rawPath: string[] = ['^'];
    _parcelData: ParcelData;
    _treeShare: TreeShare = {
        typeSet: undefined,
        actionReducer: undefined,
        registry: {},
        effectRegistry: {}
    };
    _type: Type;
    _parentTypeName: ?string;
    _updateChangeRequestOnDispatch: UpdateChangeRequestOnDispatch = doNothing;

    //
    // parcel creation
    //

    constructor(config: Config = {}) {
        if(config.fromSelf) return;

        this._parcelData = {
            value: config.value,
            meta: config.meta || {},
            child: undefined
        };

        this._handleChange = config.handleChange;

        let typeSet = new TypeSet(config.types ? config.types(TypeSet.defaultTypes) : TypeSet.defaultTypes);
        this._treeShare.typeSet = typeSet;
        this._treeShare.actionReducer = ActionReducer(typeSet);
        this._init();
    }

    _init = () => {

        this._parcelData = {
            ...this._parcelData,
            meta: this._parcelData.meta || {},
            key: this._rawPath.slice(-1)[0]
        };

        this._treeShare.registry[this.id] = this;

        //
        // apply type specific methods and properties
        //

        this._type = this._treeShare.typeSet.getType(this._parcelData);

        let {properties} = this._type || {};

        let allProperties = {
            ...(TypeSet.basicType.properties || {}),
            ...(properties || {}),
            ...(this._childProperties || {})
        };

        for(let key in allProperties) {
            this[key] = allProperties[key](this);
        }

        for(let key in this._childPropertiesPrecomputed) {
            this[key] = this._childPropertiesPrecomputed[key];
        }

        //
        // public properties
        //

        this.isChild = this._rawPath.length > 1;
        this.isParent = !!this.size;
        this.type = this._type.name;
        this.parentType = this._parentTypeName;
    }

    _create = (): Parcel => {
        let parcel = new Parcel({fromSelf: true});
        parcel._dispatchId = this.id;
        parcel._rawId = this._rawId;
        parcel._rawPath = this._rawPath;
        parcel._parcelData = this._parcelData;
        parcel._childProperties = this._childProperties;
        parcel._childPropertiesPrecomputed = this._childPropertiesPrecomputed;
        parcel._parentTypeName = this._parentTypeName;
        parcel._treeShare = this._treeShare;
        return parcel;
    };

    //
    // private methods
    //

    _fireAction = (type: string, payload: any, keyPath: any) => {
        this._dispatch(new Action({type, keyPath, payload}));
    };

    _dispatch = (dispatchable: Action|Action[]|ChangeRequest) => {

        let {
            _updateChangeRequestOnDispatch,
            _handleChange
        } = this;

        let changeRequest: ChangeRequest = dispatchable instanceof ChangeRequest
            ? dispatchable
            : new ChangeRequest(dispatchable);

        changeRequest._actionReducer = this._treeShare.actionReducer;
        changeRequest._typeSet = this._treeShare.typeSet;

        if(!changeRequest._originId) {
            changeRequest._originId = this.id;
            changeRequest._originPath = this.path;
        }

        // clear changeRequest's cache
        changeRequest = changeRequest._create({});

        if(_handleChange) {
            let changeRequestWithBase = changeRequest._create({
                prevData: this.data
            });
            let parcelData = changeRequestWithBase.nextData;

            if(!parcelData) {
                return;
            }

            let parcelWithChangedData = this._create();
            parcelWithChangedData._handleChange = _handleChange;
            parcelWithChangedData._parcelData = parcelData;
            parcelWithChangedData._init();

            _handleChange(parcelWithChangedData, changeRequestWithBase);
            return;
        }

        this._dispatchToParent(_updateChangeRequestOnDispatch(changeRequest));
    };

    _dispatchToParent = (changeRequest: ChangeRequest) => {
        let parcel = this._treeShare.registry[this._dispatchId];
        if(parcel) {
            parcel._dispatch(changeRequest);
        }
    };

    _changeAndReturn = (changeCatcher: (parcel: Parcel) => void): [Parcel, ?ChangeRequest] => {
        let result;
        let {_handleChange} = this;

        // swap out the parcels real _handleChange with a spy
        this._handleChange = (parcel, changeRequest) => {
            parcel._handleChange = _handleChange;
            result = [parcel, changeRequest];
        };

        changeCatcher(this);
        this._handleChange = _handleChange;
        if(!result) {
            return [this, undefined];
        }
        return result;
    };

    _boundarySplit = (handleChange): Parcel => {
        let parcel = this._create();
        parcel._handleChange = handleChange;
        parcel._rawId = this._idPushModifier('bs');
        parcel._init();
        return parcel;
    };

    _idPushModifier = (name: string): string[] => {
        return [...this._rawId, `~${name}`];
    };

    _idPushModifierUpdater = (prefix: string, updater: ParcelValueUpdater): string[] => {
        return this._idPushModifier(`${prefix}-${HashString((updater._updater || updater).toString())}`);
    };

    _effectUpdate = (effectUpdater: ParcelValueUpdater) => {
        let {_treeShare} = this;
        let effectId = `${this.id}-${HashString(effectUpdater.toString())}`;

        // throttle effects with the same effectId
        // the delay added by throttling is fine because these effects are async anyway
        if(_treeShare.effectRegistry[effectId]) {
            return;
        }
        _treeShare.effectRegistry[effectId] = true;

        setTimeout(() => {
            // apply the effect to the current version of the corresponding parcel
            let parcel = _treeShare.registry[this.id];
            if(parcel) {
                // remember to make this action exempt from history
                // when history is added
                parcel.update(effectUpdater);
            }
            delete _treeShare.effectRegistry[effectId];
        }, 100);
    };

    //
    // getters
    //

    // $FlowFixMe - this doesn't have side effects
    get data(): ParcelData {
        return this._parcelData;
    }

    // $FlowFixMe - this doesn't have side effects
    get value(): * {
        return this._parcelData.value;
    }

    // $FlowFixMe - this doesn't have side effects
    get meta(): * {
        let {meta} = this._parcelData;
        return {...meta};
    }

    // $FlowFixMe - this doesn't have side effects
    get key(): Key {
        return this._parcelData.key;
    }

    // $FlowFixMe - this doesn't have side effects
    get id(): string {
        return this._rawId.join('.');
    }

    // $FlowFixMe - this doesn't have side effects
    get path(): Array<Key> {
        return this._rawPath.slice(1);
    }

    //
    // public methods
    //

    // Branch methods

    has = (key: any): boolean => {
        this._parcelData = this._treeShare.typeSet.createChildKeys(this._parcelData, true);
        return this._type.internalProperties._has(
            this._parcelData,
            key
        );
    };

    get = (key: any, notFoundValue: any): Parcel => {
        let cachedChildParcel: ?Parcel = this._childParcelCache.get(key);
        if(cachedChildParcel) {
            return cachedChildParcel;
        }

        this._parcelData = this._treeShare.typeSet.createChildKeys(this._parcelData, true);
        let [childParcelData, newParcelData] = this._type.internalProperties._get(
            this._parcelData,
            key,
            notFoundValue
        );

        let childKey = childParcelData.key;

        let childOnDispatch = (changeRequest) => changeRequest._addStep({
            type: 'get',
            key: childKey
        });

        let rawId = [...this._rawId, escapeKey(childKey)];
        let rawPath = [...this._rawPath, childKey];

        let childPropertiesPrecomputedToAdd = {};
        let {childPropertiesPrecomputed = {}} = this._type;
        let {childProperties = {}} = this._type;

        for(let key in childPropertiesPrecomputed) {
            childPropertiesPrecomputedToAdd[key] = childPropertiesPrecomputed[key](
                childParcelData,
                newParcelData || this._parcelData
            );
        }

        let childParcel = this._create();
        childParcel._parcelData = childParcelData,
        childParcel._updateChangeRequestOnDispatch = childOnDispatch,
        childParcel._rawId = rawId;
        childParcel._rawPath = rawPath;
        childParcel._childProperties = childProperties;
        childParcel._childPropertiesPrecomputed = childPropertiesPrecomputedToAdd;
        childParcel._parentTypeName = this.type;
        childParcel._init();

        this._childParcelCache.set(key, childParcel);
        return childParcel;
    };

    getIn = (keyPath: string[], notFoundValue: any): Parcel => {
        var parcel = this;
        for(let i = 0; i < keyPath.length; i++) {
            parcel = parcel.get(keyPath[i], i < keyPath.length - 1 ? {} : notFoundValue);
        }
        return parcel;
    };

    children = (mapper: ParcelMapper = doNothing): any => {
        return this._type.internalProperties._mapKeys(
            this._parcelData,
            key => mapper(this.get(key), key, this)
        );
    };

    metaAsParcel = (key: string): Parcel => {
        let parcel = this._create();
        parcel._parcelData = {
            value: this.meta[key],
            meta: this.meta
        };
        parcel._handleChange = (parcel, changeRequest) => {
            let newActions = changeRequest.actions.filter(action => action.type === 'basic.setMeta');

            if(newActions.length !== changeRequest.actions.length) {
                newActions.unshift(
                    new Action({
                        type: 'basic.setMeta',
                        payload: {
                            [key]: parcel.value
                        }
                    })
                );
            }

            this.dispatch(
                changeRequest._create({
                    actions: newActions
                })
            );
        };
        parcel._rawId = this._idPushModifier(`mp-${key}`);
        parcel._init();
        return parcel;
    };

    dispatch = this._dispatch;

    // Modify methods

    modifyDown = (updater: ParcelValueUpdater): Parcel => {
        let preparedUpdater = combine(updater);
        let parcel = this._create();
        parcel._rawId = this._idPushModifierUpdater('md', updater);
        parcel._parcelData = preparedUpdater(this._parcelData);
        parcel._updateChangeRequestOnDispatch = (changeRequest) => changeRequest._addStep({
            type: 'md',
            updater: parcelData => preparedUpdater(parcelData)
        });
        parcel._init();
        return parcel;
    };

    modifyUp = (updater: ParcelValueUpdater): Parcel => {
        let preparedUpdater = combine(updater);
        let parcel = this._create();
        parcel._rawId = this._idPushModifierUpdater('mu', updater);
        parcel._updateChangeRequestOnDispatch = (changeRequest) => changeRequest._addStep({
            type: 'mu',
            updater: (parcelData, changeRequest) => preparedUpdater({...parcelData, changeRequest}),
            changeRequest,
            effectUpdate: this._effectUpdate
        });
        parcel._init();
        return parcel;
    };

    initialMeta = (initialMeta: ParcelMeta): Parcel => {
        return this.modifyDown(({meta}) => ({meta: {...initialMeta, ...meta}}));
    };

    // Composition methods

    pipe = (...updaters: ParcelUpdater[]): Parcel => pipeWith(this, ...updaters);
}
