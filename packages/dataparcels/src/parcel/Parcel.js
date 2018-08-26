// @flow
import Types from '../types/Types';
import {ReadOnlyError} from '../errors/Errors';
import type {
    ParcelData,
    ParcelConfig,
    ParcelConfigInternal,
    ParcelMapper,
    ParcelMeta,
    ParcelMetaUpdater,
    CreateParcelConfigType,
    Key,
    Index
} from '../types/Types';

import Modifiers from '../modifiers/Modifiers';
import ParcelGetMethods from './methods/ParcelGetMethods';
import ParcelChangeMethods from './methods/ParcelChangeMethods';
import ParentGetMethods from './methods/ParentGetMethods';

import ActionMethods from './ActionMethods';
import ChildChangeMethods from './ChildChangeMethods';
import ElementChangeMethods from './ElementChangeMethods';
import IndexedChangeMethods from './IndexedChangeMethods';
import ModifyMethods from './ModifyMethods';
import ParcelTypes from './ParcelTypes';
import ParentChangeMethods from './ParentChangeMethods';

import ParcelId from '../parcelId/ParcelId';
import Treeshare from '../treeshare/Treeshare';

import map from 'unmutable/lib/map';

const DEFAULT_CONFIG_INTERNAL = {
    onDispatch: undefined,
    child: undefined,
    meta: {},
    id: new ParcelId(),
    modifiers: undefined,
    parent: undefined,
    treeshare: undefined
};

export default class Parcel {

    //
    // private
    //

    _methods: { [key: string]: Function };
    _onHandleChange: ?Function;
    _onDispatch: ?Function;
    _parcelData: ParcelData;
    _id: ParcelId;
    _modifiers: Modifiers;
    _treeshare: Treeshare;
    _parcelTypes: ParcelTypes;
    _applyModifiers: Function;
    _dispatchBuffer: ?Function;
    _dispatchBuffer: ?Function;
    _handleChange: Function;

    // Change methods
    dispatch: Function;
    batch: Function;

    // Parent change methods
    set: Function;
    setIn: Function;
    update: Function;
    updateIn: Function;

    // Indexed change methods
    delete: Function;
    insertAfter: Function;
    insertBefore: Function;
    push: Function;
    pop: Function;
    shift: Function;
    swap: Function;
    swapNext: Function;
    swapPrev: Function;
    unshift: Function;

    // Child change methods
    deleteSelf: Function;

    // Element change methods
    insertAfterSelf: Function;
    insertBeforeSelf: Function;
    swapWithSelf: Function;
    swapNextWithSelf: Function;
    swapPrevWithSelf: Function;

    // Modify methods
    modifyValue: Function;
    modifyChange: Function;
    modifyChangeValue: Function;
    initialMeta: Function;
    addModifier: Function;
    addDescendantModifier: Function;

    // Type methods
    isChild: Function;
    isElement: Function;
    isIndexed: Function;
    isParent: Function;
    isTopLevel: Function;

    constructor(config: ParcelConfig = {}, _configInternal: ?ParcelConfigInternal) {
        Types(`Parcel() expects param "config" to be`, `object`)(config);

        let {
            handleChange,
            value,
            debugRender = false
        } = config;

        Types(`Parcel() expects param "config.handleChange" to be`, `functionOptional`)(handleChange);
        Types(`Parcel() expects param "config.debugRender" to be`, `boolean`)(debugRender);

        let {
            onDispatch,
            child,
            meta,
            id,
            modifiers,
            parent,
            treeshare
        } = _configInternal || DEFAULT_CONFIG_INTERNAL;

        this._onHandleChange = handleChange;
        this._onDispatch = onDispatch;

        this._parcelData = {
            value,
            child,
            key: id.key(),
            meta
        };

        // types
        this._parcelTypes = new ParcelTypes(
            value,
            parent && parent._parcelTypes,
            id
        );

        this._id = id.setTypeCode(this._parcelTypes.toTypeCode());

        // modifiers
        this._modifiers = modifiers || new Modifiers();

        // treeshare
        this._treeshare = treeshare || new Treeshare({debugRender});
        this._treeshare.registry.set(id.id(), this);

        // parcel type methods
        this.isChild = this._parcelTypes.isChild;
        this.isElement = this._parcelTypes.isElement;
        this.isIndexed = this._parcelTypes.isIndexed;
        this.isParent = this._parcelTypes.isParent;
        this.isTopLevel = this._parcelTypes.isTopLevel;

        // $FlowFixMe - I want to use computed properties, go away flow
        let addMethods = map((fn, name) => this[name] = fn);
        addMethods({
            // $FlowFixMe
            ...ActionMethods(this),
            // $FlowFixMe
            ...ModifyMethods(this)
        });

        // methods
        this._methods = {
            // $FlowFixMe
            ...ParcelGetMethods(this),
            // $FlowFixMe
            ...ParcelChangeMethods(this, this.dispatch),
            // $FlowFixMe
            ...ParentGetMethods(this)
        };

        addMethods({
            // $FlowFixMe
            ...ParentChangeMethods(this, this.dispatch),
            // $FlowFixMe
            ...IndexedChangeMethods(this, this.dispatch),
            // $FlowFixMe
            ...ChildChangeMethods(this, this.dispatch),
            // $FlowFixMe
            ...ElementChangeMethods(this, this.dispatch)
        });
    }

    //
    // private
    //

    _create: Function = (createParcelConfig: CreateParcelConfigType): Parcel => {
        let {
            id = this._id,
            parcelData: {
                child,
                value,
                meta = {}
            },
            parent,
            onDispatch = this.dispatch
        } = createParcelConfig;

        let parcel: Parcel = new Parcel(
            {
                value
            },
            {
                child,
                meta,
                id,
                modifiers: this._modifiers,
                onDispatch,
                parent,
                treeshare: this._treeshare
            }
        );

        return parent
            ? parcel._applyModifiers()
            : parcel;
    };

    //
    // advanced users only - TODO move to advanced methods!
    //

    getInternalLocationShareData = (): Object => {
        return this._treeshare.locationShare.get(this.path);
    }

    setInternalLocationShareData = (partialData: Object) => {
        Types(`setInternalLocationShareData() expects param "partialData" to be`, `object`)(partialData);
        this._treeshare.locationShare.set(this.path, partialData);
    }

    //
    // getters
    //

    // $FlowFixMe - this doesn't have side effects
    get data(): ParcelData {
        return this._parcelData;
    }

    // $FlowFixMe - this doesn't have side effects
    set data(value: *) {
        ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get value(): * {
        return this._parcelData.value;
    }

    // $FlowFixMe - this doesn't have side effects
    set value(value: *) {
        ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get meta(): * {
        let {meta} = this._parcelData;
        return {...meta};
    }

    // $FlowFixMe - this doesn't have side effects
    set meta(value: *) {
        ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get key(): Key {
        return this._id.key();
    }

    // $FlowFixMe - this doesn't have side effects
    set key(value: *) {
        ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get id(): string {
        return this._id.id();
    }

    // $FlowFixMe - this doesn't have side effects
    set id(value: *) {
        ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get path(): Array<Key> {
        return this._id.path();
    }

    // $FlowFixMe - this doesn't have side effects
    set path(value: *) {
        ReadOnlyError();
    }

    // Spread methods
    spread = (): * => this._methods.spread();
    spreadDOM = (): * => this._methods.spreadDOM();

    // Composition methods
    pipe = (...updaters: Function[]): Parcel => this._methods.pipe(...updaters);

    // Status methods
    hasDispatched = (): boolean => this._methods.hasDispatched();

    // Change Methods
    setSelf = (value: *) => this._methods.setSelf(value);
    updateSelf = (updater: Function) => this._methods.updateSelf(updater);
    onChange = (value: *) => this._methods.onChange(value);
    onChangeDOM = (event: *) => this._methods.onChangeDOM(event);
    setMeta = (partialMeta: ParcelMeta) => this._methods.setMeta(partialMeta);
    updateMeta = (updater: ParcelMetaUpdater) => this._methods.updateMeta(updater);
    setChangeRequestMeta = (partialMeta: ParcelMeta) => this._methods.setChangeRequestMeta(partialMeta);
    ping = () => this._methods.ping();

    // Parent get Methods
    has = (key: Key|Index): boolean => this._methods.has(key);
    get = (key: Key|Index, notFoundValue: ?* = undefined): Parcel => this._methods.get(key, notFoundValue);
    getIn = (keyPath: Array<Key|Index>, notFoundValue: ?* = undefined): Parcel => this._methods.getIn(keyPath, notFoundValue);
    toObject = (mapper: ParcelMapper = _ => _): { [key: string]: * } => this._methods.toObject(mapper);
    toArray = (mapper: ParcelMapper = _ => _): Array<*> => this._methods.toArray(mapper);
    size = (): number => this._methods.size();
}
