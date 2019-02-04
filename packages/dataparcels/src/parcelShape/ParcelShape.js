// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {ParentType} from '../types/Types';
import type {ParcelShapeValueUpdater} from '../types/Types';
import type {ParcelShapeConfigInternal} from '../types/Types';
import type {ParcelShapeUpdater} from '../types/Types';
import type {ParcelShapeUpdateFunction} from '../types/Types';
import type {ParcelShapeSetMeta} from '../types/Types';

import Types from '../types/Types';
import {ReadOnlyError} from '../errors/Errors';

import ParcelTypes from '../parcel/ParcelTypes';
import ParcelId from '../parcelId/ParcelId';

import ParcelShapeParentGetMethods from './methods/ParcelShapeParentGetMethods';
import ParcelShapeParentSetMethods from './methods/ParcelShapeParentSetMethods';
import ParcelShapeSetMethods from './methods/ParcelShapeSetMethods';
import ParcelShapeIndexedSetMethods from './methods/ParcelShapeIndexedSetMethods';

import FilterMethods from '../util/FilterMethods';

import overload from 'unmutable/lib/util/overload';
import pipeWith from 'unmutable/lib/util/pipeWith';

import prepareChildKeys from '../parcelData/prepareChildKeys';

export default class ParcelShape {
    constructor(value: any, _configInternal: ?ParcelShapeConfigInternal) {
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
            ...FilterMethods("Parent", ParcelShapeParentGetMethods)(this),
            // $FlowFixMe
            ...FilterMethods("Parent", ParcelShapeParentSetMethods)(this),
            // $FlowFixMe
            ...ParcelShapeSetMethods(this),
            // $FlowFixMe
            ...FilterMethods("Indexed", ParcelShapeIndexedSetMethods)(this)
        };
    }

    //
    // private
    //

    // from constructor
    _id: ParcelId;
    _methods: { [key: string]: any };
    _parent: ?ParcelShape;
    _parcelData: ParcelData;
    _parcelTypes: ParcelTypes;

    _pipeSelf = (fn: Function, _configInternal: ?ParcelShapeConfigInternal): ParcelShape => pipeWith(
        this._parcelData,
        fn,
        data => ParcelShape.fromData(data, _configInternal)
    );

    _isParcelShape = (maybe: any): boolean => maybe instanceof ParcelShape;

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

    static fromData(parcelData: ParcelData, _configInternal: ?ParcelShapeConfigInternal): ParcelShape {
        Types(`ParcelShape()`, `fromData`, `parcelData`)(parcelData);
        let parcelShape = new ParcelShape(parcelData.value, _configInternal);
        parcelShape._parcelData = parcelData;
        return parcelShape;
    }

    static update(updater: ParcelShapeUpdater): ParcelShapeUpdateFunction {
        let fn = (parcelData: ParcelData): ParcelData => {
            return ParcelShape
                .fromData(parcelData)
                .updateShape(updater)
                .data;
        };

        fn._isParcelUpdater = true;
        fn._updater = updater;
        return fn;
    }

    // only need this to reference static methods on ParcelShape
    // without creating circular dependencies
    _parcelShapeUpdate = ParcelShape.update;

    // Parent methods
    has = (key: Key|Index): boolean => this._methods.has(key);
    size = (): number => this._methods.size();
    get = (key: Key|Index, notFoundValue: ?any = undefined): ParcelShape => this._methods.get(key, notFoundValue);
    getIn = (keyPath: Array<Key|Index>, notFoundValue: ?any = undefined): ParcelShape => this._methods.getIn(keyPath, notFoundValue);
    children = (): ParentType<ParcelShape> => this._methods.children();
    toObject = (): { [key: string]: ParcelShape } => this._methods.toObject();
    toArray = (): Array<ParcelShape> => this._methods.toArray();

    // Change methods
    set = overload({
        ["1"]: (value: any) => this._methods.setSelf(value),
        ["2"]: (key: Key|Index, value: any) => this.setIn([key], value)
    });
    setMeta = (partialMeta: ParcelShapeSetMeta) => this._methods.setMeta(partialMeta);
    setIn = (keyPath: Array<Key|Index>, value: any) => this._methods.setIn(keyPath, value);
    delete = (key: Key|Index) => this.deleteIn([key]);
    deleteIn = (keyPath: Array<Key|Index>) => this._methods.deleteIn(keyPath);
    update = overload({
        ["1"]: (updater: ParcelShapeValueUpdater): ParcelShape => this._methods.update(updater),
        ["2"]: (key: Key|Index, updater: ParcelShapeValueUpdater): ParcelShape => this.updateIn([key], updater)
    });
    updateShape = overload({
        ["1"]: (updater: ParcelShapeUpdater): ParcelShape => this._methods.updateShape(updater),
        ["2"]: (key: Key|Index, updater: ParcelShapeUpdater): ParcelShape => this.updateShapeIn([key], updater)
    });
    updateIn = (keyPath: Array<Key|Index>, updater: ParcelShapeValueUpdater) => this._methods.updateIn(keyPath, updater);
    updateShapeIn = (keyPath: Array<Key|Index>, updater: ParcelShapeValueUpdater) => this._methods.updateShapeIn(keyPath, updater);

    // Indexed methods
    insertAfter = (key: Key|Index, value: any) => this._methods.insertAfter(key, value);
    insertBefore = (key: Key|Index, value: any) => this._methods.insertBefore(key, value);
    move = (keyA: Key|Index, keyB: Key|Index) => this._methods.move(keyA, keyB);
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
