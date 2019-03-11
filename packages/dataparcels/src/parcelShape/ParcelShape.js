// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {ParcelParent} from '../types/Types';
import type {ParentType} from '../types/Types';
import type {ParcelShapeValueUpdater} from '../types/Types';
import type {ParcelShapeUpdater} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';
import type {ParcelShapeSetMeta} from '../types/Types';
import type {ParcelDataEvaluator} from '../types/Types';

import Types from '../types/Types';
import {ReadOnlyError} from '../errors/Errors';
import {ShapeUpdaterNonShapeChildError} from '../errors/Errors';

import ParcelId from '../parcelId/ParcelId';

import ParcelShapeParentGetMethods from './methods/ParcelShapeParentGetMethods';
import ParcelShapeParentSetMethods from './methods/ParcelShapeParentSetMethods';
import ParcelShapeSetMethods from './methods/ParcelShapeSetMethods';
import ParcelShapeIndexedSetMethods from './methods/ParcelShapeIndexedSetMethods';

import FilterMethods from '../util/FilterMethods';

import clear from 'unmutable/lib/clear';
import del from 'unmutable/lib/delete';
import map from 'unmutable/lib/map';
import set from 'unmutable/lib/set';
import overload from 'unmutable/lib/util/overload';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

import dangerouslyUpdateParcelData from '../parcelData/dangerouslyUpdateParcelData';
import prepareChildKeys from '../parcelData/prepareChildKeys';
import isIndexedValue from '../parcelData/isIndexedValue';
import isParentValue from '../parcelData/isParentValue';
import parcelUpdate from '../parcelData/update';

export default class ParcelShape {
    constructor(value: any, _parent: ?ParcelParent) {
        this._parcelData = {
            value
        };

        // types
        this._isChild = !!(_parent);
        this._isElement = !!(_parent && _parent.isIndexed);
        this._isIndexed = isIndexedValue(value);
        this._isParent = isParentValue(value);

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
    _isChild: boolean;
    _isElement: boolean;
    _isIndexed: boolean;
    _isParent: boolean;
    _methods: { [key: string]: any };
    _parcelData: ParcelData;

    _pipeSelf = (fn: Function, _parent: ?ParcelParent): ParcelShape => pipeWith(
        this._parcelData,
        fn,
        data => ParcelShape.fromData(data, _parent)
    );

    _isParcelShape = (maybe: any): boolean => maybe instanceof ParcelShape;

    _prepareChildKeys = () => {
        // prepare child keys only once per parcel instance
        // by preparing them and mutating this.parcelData

        if(!this._parcelData.child) {
            this._parcelData = prepareChildKeys()(this._parcelData);
        }
    }

    _updateShape = (updater: ParcelShapeUpdater): ParcelShape => {
        let updated: any = updater(this);
        if(this._isParcelShape(updated)) {
            return updated;
        }

        if(!isParentValue(updated)) {
            return this.set(updated);
        }

        return this._pipeSelf(pipe(
            set('value', clear()(updated)),
            del('child'),
            ...pipeWith(
                updated,
                map((childParcelShape: ParcelShape, key: string|number): ParcelDataEvaluator => {
                    if(!this._isParcelShape(childParcelShape)) {
                        throw ShapeUpdaterNonShapeChildError();
                    }
                    return parcelUpdate(key, () => childParcelShape.data);
                })
            )
        ));
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

    static fromData(parcelData: ParcelData, _parent: ?ParcelParent): ParcelShape {
        Types(`ParcelShape()`, `fromData`, `parcelData`)(parcelData);
        let parcelShape = new ParcelShape(parcelData.value, _parent);
        parcelShape._parcelData = parcelData;
        return parcelShape;
    }

    static update(updater: ParcelShapeUpdater): ParcelValueUpdater {
        let fn = (parcelData: ParcelData, changeRequest: *): ParcelData => {
            return ParcelShape
                .fromData(parcelData)
                ._updateShape((parcelShape) => updater(parcelShape, changeRequest))
                .data;
        };

        fn._updater = updater;
        return dangerouslyUpdateParcelData(fn);
    }

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
    updateIn = (keyPath: Array<Key|Index>, updater: ParcelShapeValueUpdater) => this._methods.updateIn(keyPath, updater);

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
    isChild = (): boolean => this._isChild;
    isElement = (): boolean => this._isElement;
    isIndexed = (): boolean => this._isIndexed;
    isParent = (): boolean => this._isParent;
    isTopLevel = (): boolean => !this._isChild;
}
