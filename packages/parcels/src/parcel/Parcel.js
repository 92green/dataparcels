// @flow
import Types from '../types/Types';
import type {
    ParcelData,
    ParcelConfig,
    ParcelConfigInternal,
    CreateParcelConfigType
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
    // private data
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

    //
    // private methods
    //

    // - id methods
    _typedPathString: Function;

    //
    // public get methods
    //

    // get methods
    // - type methods
    isChild: Function;
    isElement: Function;
    isIndexed: Function;
    isParent: Function;
    isTopLevel: Function;
    // - id methods
    key: Function;
    id: Function;
    path: Function;
    // - value parcel methods
    raw: Function;
    data: Function;
    value: Function;
    spread: Function;
    spreadDOM: Function;
    meta: Function;
    hasDispatched: Function;
    getInternalLocationShareData: Function;
    // - parent parcel methods
    has: Function;
    get: Function;
    getIn: Function;
    toObject: Function;
    toArray: Function;
    size: Function;

    //
    // public change methods
    //

    // - action methods
    _handleChange: Function;
    dispatch: Function;
    batch: Function;
    // - value parcel methods
    setSelf: Function;
    updateSelf: Function;
    onChange: Function;
    onChangeDOM: Function;
    setMeta: Function;
    updateMeta: Function;
    setChangeRequestMeta: Function;
    ping: Function;
    // - parent parcel methods
    set: Function;
    setIn: Function;
    update: Function;
    updateIn: Function;
    // - indexed parcel methods
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
    // - child parcel methods
    deleteSelf: Function;
    // - element parcel methods
    insertAfterSelf: Function;
    insertBeforeSelf: Function;
    swapWithSelf: Function;
    swapNextWithSelf: Function;
    swapPrevWithSelf: Function;

    //
    // public modify methods
    //

    // - modify methods
    modify: Function;
    modifyData: Function;
    modifyValue: Function;
    modifyChange: Function;
    modifyChangeValue: Function;
    initialMeta: Function;
    addModifier: Function;
    addDescendantModifier: Function;

    //
    // public mutation methods
    //

    // - value parcel methods
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

        // id methods
        this._typedPathString = this._id.typedPathString;
        this.key = this._id.key;
        this.id = this._id.id;
        this.path = this._id.path;

        // method creators
        // $FlowFixMe - I want to use compued properties, go away flow
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
}
