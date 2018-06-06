// @flow
import type {
    ParcelData,
    ParcelConfig,
    ParcelConfigInternal,
    CreateParcelConfigType
} from '../types/Types';

import type Action from '../action/Action';

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

    _handleChange: Function;
    _parcelData: ParcelData;
    _id: ParcelId;
    _modifiers: Modifiers;
    _treeshare: Treeshare;
    _actionBuffer: Action[][] = [];
    _parcelTypes: ParcelTypes;
    _applyModifiers: Function;

    //
    // private methods
    //

    // - action methods
    _buffer: Function;
    _flush: Function;
    _skipReducer: Function;
    _thunkReducer: Function;
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
    equals: Function;
    hasDispatched: Function;
    findAllMatching: Function;
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
    dispatch: Function;
    batch: Function;
    // - value parcel methods
    setSelf: Function;
    updateSelf: Function;
    onChange: Function;
    onChangeDOM: Function;
    setMeta: Function;
    updateMeta: Function;
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
    initialMeta: Function;
    addPreModifier: Function;
    addModifier: Function;
    addDescendantModifier: Function;

    //
    // public mutation methods
    //

    // - value parcel methods
    setInternalLocationShareData: Function;

    constructor(parcelConfig: ParcelConfig = {}, _parcelConfigInternal: ?ParcelConfigInternal) {
        let {
            handleChange = () => {},
            value = undefined,
            debugRender = false
        } = parcelConfig;

        let {
            child,
            meta,
            id,
            modifiers,
            parent,
            treeshare
        } = _parcelConfigInternal || DEFAULT_CONFIG_INTERNAL;

        this._handleChange = handleChange;
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
            parcelData: {
                child,
                value,
                meta
            },
            handleChange = this._skipReducer((parcel: Parcel, action: Action|Action[]) => {
                this.dispatch(action);
            }),
            id = this._id,
            modifiers = this._modifiers,
            parent = undefined
        } = createParcelConfig;

        let parcel: Parcel = new Parcel(
            {
                handleChange,
                value
            },
            {
                child,
                meta,
                id,
                modifiers,
                parent,
                treeshare: this._treeshare
            }
        );

        return parent
            ? parcel._applyModifiers()
            : parcel;
    };
}
