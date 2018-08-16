// @flow
import Types from '../types/Types';
import {ReadOnlyError} from '../errors/Errors';
import type {
    ParcelData,
    ParcelConfig,
    ParcelConfigInternal,
    CreateParcelConfigType,
    Key
} from '../types/Types';

import Modifiers from '../modifiers/Modifiers';

import ActionMethods from './ActionMethods';
import ChildParcelMethods from './ChildParcelMethods';
import ElementParcelMethods from './ElementParcelMethods';
import IndexedParcelMethods from './IndexedParcelMethods';
import ModifyMethods from './ModifyMethods';
import ParcelTypes from './ParcelTypes';
import ParentParcelMethods from './ParentParcelMethods';
import ValueParcelMethods from './ValueParcelMethods';

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

    _onHandleChange: ?Function;
    _onDispatch: ?Function;
    _parcelData: ParcelData;
    _id: ParcelId;
    _modifiers: Modifiers;
    _treeshare: Treeshare;
    _parcelTypes: ParcelTypes;
    _applyModifiers: Function;
    _dispatchBuffer: ?Function;
    _handleChange: Function;

    //
    // public
    //

    // Parent get methods
    has: Function;
    get: Function;
    getIn: Function;
    toObject: Function;
    toArray: Function;
    size: Function;

    // Spread methods
    spread: Function;
    spreadDOM: Function;

    // Composition methods
    pipe: Function;

    // Change methods
    onChange: Function;
    onChangeDOM: Function;
    setSelf: Function;
    updateSelf: Function;
    setMeta: Function;
    updateMeta: Function;
    setChangeRequestMeta: Function;
    dispatch: Function;
    batch: Function;
    ping: Function;

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

    // -Status methods
    hasDispatched: Function;

    // Location share data methods
    getInternalLocationShareData: Function;
    setInternalLocationShareData: Function;

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

        // method creators
        // $FlowFixMe - I want to use computed properties, go away flow
        let addMethods = map((fn, name) => this[name] = fn);
        addMethods({
            // $FlowFixMe
            ...ActionMethods(this),
            // $FlowFixMe
            ...ChildParcelMethods(this),
            // $FlowFixMe
            ...ElementParcelMethods(this),
            // $FlowFixMe
            ...IndexedParcelMethods(this),
            // $FlowFixMe
            ...ModifyMethods(this),
            // $FlowFixMe
            ...ParentParcelMethods(this),
            // $FlowFixMe
            ...ValueParcelMethods(this)
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
}
