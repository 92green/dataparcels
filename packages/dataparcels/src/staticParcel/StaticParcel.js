// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {ParentType} from '../types/Types';
import type {StaticParcelValueUpdater} from '../types/Types';
import type {StaticParcelConfigInternal} from '../types/Types';
import type {StaticParcelUpdater} from '../types/Types';
import type {StaticParcelSetMeta} from '../types/Types';

import Types from '../types/Types';
import {ReadOnlyError} from '../errors/Errors';

import ParcelTypes from '../parcel/ParcelTypes';
import ParcelId from '../parcelId/ParcelId';

import StaticParentGetMethods from './methods/StaticParentGetMethods';
import StaticParentSetMethods from './methods/StaticParentSetMethods';
import StaticSetMethods from './methods/StaticSetMethods';
import StaticIndexedSetMethods from './methods/StaticIndexedSetMethods';

import FilterMethods from '../util/FilterMethods';

import overload from 'unmutable/lib/util/overload';
import pipeWith from 'unmutable/lib/util/pipeWith';

import prepareChildKeys from '../parcelData/prepareChildKeys';

export default class StaticParcel {
    constructor(value: any, _configInternal: ?StaticParcelConfigInternal) {
        this._parcelData = {
            value
        };

        let {parent} = _configInternal || {};

        // parent
        if(parent) {
            // $FlowFixMe
            this._parent = parent;
        }

        // types
        this._parcelTypes = new ParcelTypes(
            value,
            parent && parent._parcelTypes,
            !parent
        );

        // methods
        this._methods = {
            // $FlowFixMe
            ...FilterMethods("Parent", StaticParentGetMethods)(this),
            // $FlowFixMe
            ...FilterMethods("Parent", StaticParentSetMethods)(this),
            // $FlowFixMe
            ...StaticSetMethods(this),
            // $FlowFixMe
            ...FilterMethods("Indexed", StaticIndexedSetMethods)(this)
        };
    }

    //
    // private
    //

    // from constructor
    _id: ParcelId;
    _methods: { [key: string]: any };
    _parent: ?StaticParcel;
    _parcelData: ParcelData;
    _parcelTypes: ParcelTypes;

    static _updateFromData(updater: StaticParcelUpdater): Function {
        return (parcelData: ParcelData): ParcelData => StaticParcel
            .fromData(parcelData)
            .updateShape(updater)
            .data;
    }

    // only need this to reference static methods on StaticParcel
    // without creating circular dependencies
    _instanceUpdateFromData = StaticParcel._updateFromData;

    _pipeSelf = (fn: Function, _configInternal: ?StaticParcelConfigInternal): StaticParcel => pipeWith(
        this._parcelData,
        fn,
        data => StaticParcel.fromData(data, _configInternal)
    );

    _isStaticParcel = (maybe: any): boolean => maybe instanceof StaticParcel;

    _prepareChildKeys = () => {
        // prepare child keys only once per parcel instance
        // by preparing them and mutating this.parcelData

        if(!this._parcelData.child) {
            this._parcelData = prepareChildKeys()(this._parcelData);
        }
    }

    //
    // getters
    //

    // $FlowFixMe - this doesn't have side effects
    get data(): ParcelData {
        return this._parcelData;
    }

    // $FlowFixMe - this doesn't have side effects
    set data(value: any) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get value(): any {
        return this._parcelData.value;
    }

    // $FlowFixMe - this doesn't have side effects
    set value(value: any) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get meta(): any {
        let {meta = {}} = this._parcelData;
        return {...meta};
    }

    // $FlowFixMe - this doesn't have side effects
    set meta(value: any) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get key(): Key {
        return this._parcelData.key;
    }

    // $FlowFixMe - this doesn't have side effects
    set key(value: any) {
        throw ReadOnlyError();
    }

    //
    // public methods
    //

    static fromData(parcelData: ParcelData, _configInternal: ?StaticParcelConfigInternal): StaticParcel {
        Types(`StaticParcel()`, `fromData`, `parcelData`)(parcelData);
        let staticParcel = new StaticParcel(parcelData.value, _configInternal);
        staticParcel._parcelData = parcelData;
        return staticParcel;
    }

    // Parent methods
    has = (key: Key|Index): boolean => this._methods.has(key);
    size = (): number => this._methods.size();
    get = (key: Key|Index, notFoundValue: ?any = undefined): StaticParcel => this._methods.get(key, notFoundValue);
    getIn = (keyPath: Array<Key|Index>, notFoundValue: ?any = undefined): StaticParcel => this._methods.getIn(keyPath, notFoundValue);
    children = (): ParentType<StaticParcel> => this._methods.children();
    toObject = (): { [key: string]: StaticParcel } => this._methods.toObject();
    toArray = (): Array<StaticParcel> => this._methods.toArray();

    // Change methods
    set = overload({
        ["1"]: (value: any) => this._methods.setSelf(value),
        ["2"]: (key: Key|Index, value: any) => this.setIn([key], value)
    });
    setMeta = (partialMeta: StaticParcelSetMeta) => this._methods.setMeta(partialMeta);
    setIn = (keyPath: Array<Key|Index>, value: any) => this._methods.setIn(keyPath, value);
    delete = (key: Key|Index) => this.deleteIn([key]);
    deleteIn = (keyPath: Array<Key|Index>) => this._methods.deleteIn(keyPath);
    update = overload({
        ["1"]: (updater: StaticParcelValueUpdater): StaticParcel => this._methods.update(updater),
        ["2"]: (key: Key|Index, updater: StaticParcelValueUpdater): StaticParcel => this.updateIn([key], updater)
    });
    updateShape = overload({
        ["1"]: (updater: StaticParcelUpdater): StaticParcel => this._methods.updateShape(updater),
        ["2"]: (key: Key|Index, updater: StaticParcelUpdater): StaticParcel => this.updateShapeIn([key], updater)
    });
    updateIn = (keyPath: Array<Key|Index>, updater: StaticParcelValueUpdater) => this._methods.updateIn(keyPath, updater);
    updateShapeIn = (keyPath: Array<Key|Index>, updater: StaticParcelValueUpdater) => this._methods.updateShapeIn(keyPath, updater);

    // Indexed methods
    insertAfter = (key: Key|Index, value: any) => this._methods.insertAfter(key, value);
    insertBefore = (key: Key|Index, value: any) => this._methods.insertBefore(key, value);
    push = (...values: Array<any>) => this._methods.push(...values);
    pop = () => this._methods.pop();
    shift = () => this._methods.shift();
    swap = (keyA: Key|Index, keyB: Key|Index) => this._methods.swap(keyA, keyB);
    swapNext = (key: Key|Index) => this._methods.swapNext(key);
    swapPrev = (key: Key|Index) => this._methods.swapPrev(key);
    unshift = (...values: Array<any>) => this._methods.unshift(...values);

    // Type methods
    isChild = (): boolean => this._parcelTypes.isChild();
    isElement = (): boolean => this._parcelTypes.isElement();
    isIndexed = (): boolean => this._parcelTypes.isIndexed();
    isParent = (): boolean => this._parcelTypes.isParent();
    isTopLevel = (): boolean => this._parcelTypes.isTopLevel();
}
