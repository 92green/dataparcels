// @flow
import type {
    ParcelData,
    ParcelConfig,
    ParcelConfigInternal
} from '../types/Types';
import type Action from '../action/Action';

import ActionMethods from './ActionMethods';
import IdMethods from './IdMethods';
import IndexedParcel from './IndexedParcel';
import ModifyMethods from './ModifyMethods';
import ParentParcel from './ParentParcel';
import ValueParcel from './ValueParcel';

import {ROOT_MARK} from '../parcelId/config';
import idPush from '../parcelId/push';

import ParcelRegistry from '../registry/ParcelRegistry';

import isIndexed from 'unmutable/lib/util/isIndexed';
import isValueObject from 'unmutable/lib/util/isValueObject';

type CreateParcelConfigType = {
    handleChange?: Function,
    id: string,
    idAppend?: string,
    parcelData: ParcelData
};

const DEFAULT_CONFIG_INTERNAL = {
    child: undefined,
    id: ROOT_MARK,
    key: ROOT_MARK,
    registry: undefined
};

export default class Parcel {

    _handleChange: Function;
    _parcelData: ParcelData;
    _id: string;
    _registry: ParcelRegistry;
    _actionBuffer: Action[];
    _actionBufferOn: boolean;

    _isChild: boolean = false; // TODO
    _isElement: boolean = false; // TODO
    _isIndexed: boolean = false;
    _isParent: boolean = false;
    _isRoot: boolean = false; // TODO

    constructor(parcelConfig: ParcelConfig, _parcelConfigInternal: ?ParcelConfigInternal) {
        let {
            handleChange,
            value
        } = parcelConfig;

        let {
            child,
            id,
            key,
            registry
        } = _parcelConfigInternal || DEFAULT_CONFIG_INTERNAL;

        this._handleChange = handleChange;
        this._parcelData = {
            value,
            child,
            key
        };

        this._id = id;
        this._registry = registry || new ParcelRegistry(); // TODO ParcelTree?
        this._registry.set(id, this);

        // types
        this._isIndexed = isIndexed(value);
        this._isParent = isValueObject(value);

        // remaining initialization
        this._actionBuffer = [];
        this._actionBufferOn = false;
    }

    //
    // private
    //

    _create: Function = (createParcelConfig: CreateParcelConfigType): Parcel => {
        let {
            handleChange = this._handleChange,
            idAppend,
            id,
            parcelData: {
                child,
                key,
                value
            }
        } = createParcelConfig;

        if(idAppend) {
            id = idPush(idAppend)(this._id);
        }

        return new Parcel(
            {
                handleChange,
                value
            },
            {
                child,
                key,
                id,
                registry: this._registry
            }
        );
    };

    _buffer: Function = (...args) => ActionMethods(this)._buffer(...args);
    _flush: Function = (...args) => ActionMethods(this)._flush(...args);
    _skipReducer: Function = (...args) => ActionMethods(this)._skipReducer(...args);

    //
    // public
    //

    // type methods

    isChild: Function = (): boolean => this._isChild;
    isElement: Function = (): boolean => this._isElement;
    isIndexed: Function = (): boolean => this._isIndexed;
    isParent: Function = (): boolean => this._isParent;
    isRoot: Function = (): boolean => this._isRoot;

    // id methods

    key: Function = (...args) => IdMethods(this).key(...args);
    id: Function = (...args) => IdMethods(this).id(...args);
    pathId: Function = (...args) => IdMethods(this).pathId(...args);

    // get methods
    // - value parcel

    raw: Function = (...args) => ValueParcel(this).raw(...args);
    data: Function = (...args) => ValueParcel(this).data(...args);
    value: Function = (...args) => ValueParcel(this).value(...args);
    spread: Function = (...args) => ValueParcel(this).spread(...args);
    spreadDOM: Function = (...args) => ValueParcel(this).spreadDOM(...args);

    // - parent parcel

    get: Function = (...args) => ParentParcel(this).get(...args);
    getIn: Function = (...args) => ParentParcel(this).getIn(...args);
    toObject: Function = (...args) => ParentParcel(this).toObject(...args);
    toArray: Function = (...args) => ParentParcel(this).toArray(...args);
    size: Function = (...args) => ParentParcel(this).size(...args);

    // change methods
    // - value parcel

    dispatch: Function = (...args) => ActionMethods(this).dispatch(...args);
    batch: Function = (...args) => ActionMethods(this).batch(...args);

    setSelf: Function = (...args) => ValueParcel(this).setSelf(...args);
    updateSelf: Function = (...args) => ValueParcel(this).updateSelf(...args);
    onChange: Function = (...args) => ValueParcel(this).onChange(...args);
    onChangeDOM: Function = (...args) => ValueParcel(this).onChangeDOM(...args);

    // - parent parcel

    set: Function = (...args) => ParentParcel(this).set(...args);
    setIn: Function = (...args) => ParentParcel(this).setIn(...args);
    update: Function = (...args) => ParentParcel(this).update(...args);
    updateIn: Function = (...args) => ParentParcel(this).updateIn(...args);

    // - indexed parcel

    delete: Function = (...args) => IndexedParcel(this).delete(...args);
    insert: Function = (...args) => IndexedParcel(this).insert(...args);
    push: Function = (...args) => IndexedParcel(this).push(...args);
    pop: Function = (...args) => IndexedParcel(this).pop(...args);
    shift: Function = (...args) => IndexedParcel(this).shift(...args);
    swap: Function = (...args) => IndexedParcel(this).swap(...args);
    swapNext: Function = (...args) => IndexedParcel(this).swapNext(...args);
    swapPrev: Function = (...args) => IndexedParcel(this).swapPrev(...args);
    unshift: Function = (...args) => IndexedParcel(this).unshift(...args);

    // modify methods

    chain: Function = (...args) => ModifyMethods(this).chain(...args);
    modify: Function = (...args) => ModifyMethods(this).modify(...args);
    modifyValue: Function = (...args) => ModifyMethods(this).modifyValue(...args);
    modifyChange: Function = (...args) => ModifyMethods(this).modifyChange(...args);
}