// @flow
import type Action from '../change/Action';
import type ChangeRequest from '../change/ChangeRequest';
import type {CreateParcelConfigType} from '../types/Types';
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ModifierFunction} from '../types/Types';
import type {ModifierObject} from '../types/Types';
import type {ParcelBatcher} from '../types/Types';
import type {ParcelConfigInternal} from '../types/Types';
import type {ParcelConfig} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {ParcelMapper} from '../types/Types';
import type {ParcelMetaUpdater} from '../types/Types';
import type {ParcelMeta} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';

import Types from '../types/Types';
import {ReadOnlyError} from '../errors/Errors';

import Modifiers from '../modifiers/Modifiers';
import ParcelGetMethods from './methods/ParcelGetMethods';
import ParcelChangeMethods from './methods/ParcelChangeMethods';
import ActionMethods from './methods/ActionMethods';
import ParentGetMethods from './methods/ParentGetMethods';
import ParentChangeMethods from './methods/ParentChangeMethods';
import IndexedChangeMethods from './methods/IndexedChangeMethods';
import ChildChangeMethods from './methods/ChildChangeMethods';
import ElementChangeMethods from './methods/ElementChangeMethods';
import ModifyMethods from './methods/ModifyMethods';
import AdvancedMethods from './methods/AdvancedMethods';

import FilterMethods from '../util/FilterMethods';
import ParcelTypes from './ParcelTypes';
import ParcelId from '../parcelId/ParcelId';
import Treeshare from '../treeshare/Treeshare';

const DEFAULT_CONFIG_INTERNAL = () => ({
    onDispatch: undefined,
    child: undefined,
    meta: {},
    id: new ParcelId(),
    modifiers: undefined,
    parent: undefined,
    treeshare: undefined
});

export default class Parcel {
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
        } = _configInternal || DEFAULT_CONFIG_INTERNAL();

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

        let dispatch = (dispatchable: Action|Action[]|ChangeRequest) => this._methods.dispatch(dispatchable);

        // methods
        this._methods = {
            // $FlowFixMe
            ...ParcelGetMethods(this),
            // $FlowFixMe
            ...ActionMethods(this),
            // $FlowFixMe
            ...FilterMethods("Parent", ParentGetMethods)(this),
            // $FlowFixMe
            ...ParcelChangeMethods(this, dispatch),
            // $FlowFixMe
            ...FilterMethods("Parent", ParentChangeMethods)(this, dispatch),
            // $FlowFixMe
            ...FilterMethods("Indexed", IndexedChangeMethods)(this, dispatch),
            // $FlowFixMe
            ...FilterMethods("Child", ChildChangeMethods)(this, dispatch),
            // $FlowFixMe
            ...FilterMethods("Element", ElementChangeMethods)(this, dispatch),
            // $FlowFixMe
            ...ModifyMethods(this),
            // $FlowFixMe
            ...AdvancedMethods(this)
        };
    }

    //
    // private
    //

    _methods: { [key: string]: * };
    _onHandleChange: ?Function;
    _onDispatch: ?Function;
    _parcelData: ParcelData;
    _id: ParcelId;
    _modifiers: Modifiers;
    _treeshare: Treeshare;
    _parcelTypes: ParcelTypes;
    _dispatchBuffer: ?Function;
    _prepareChildKeys: Function;

    _create = (createParcelConfig: CreateParcelConfigType): Parcel => {
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

    _applyModifiers = (): Parcel => {
        return this._modifiers.applyTo(this);
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
        throw new ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get value(): * {
        return this._parcelData.value;
    }

    // $FlowFixMe - this doesn't have side effects
    set value(value: *) {
        throw new ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get meta(): * {
        let {meta = {}} = this._parcelData;
        return {...meta};
    }

    // $FlowFixMe - this doesn't have side effects
    set meta(value: *) {
        throw new ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get key(): Key {
        return this._id.key();
    }

    // $FlowFixMe - this doesn't have side effects
    set key(value: *) {
        throw new ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get id(): string {
        return this._id.id();
    }

    // $FlowFixMe - this doesn't have side effects
    set id(value: *) {
        throw new ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get path(): Array<Key> {
        return this._id.path();
    }

    // $FlowFixMe - this doesn't have side effects
    set path(value: *) {
        throw new ReadOnlyError();
    }

    //
    // public methods
    //

    // Spread methods
    spread = (): * => this._methods.spread();
    spreadDOM = (): * => this._methods.spreadDOM();

    // Composition methods
    pipe = (...updaters: Function[]): Parcel => this._methods.pipe(...updaters);

    // Status methods
    hasDispatched = (): boolean => this._methods.hasDispatched();

    // Change methods
    setSelf = (value: *) => this._methods.setSelf(value);
    updateSelf = (updater: Function) => this._methods.updateSelf(updater);
    onChange = (value: *) => this._methods.onChange(value);
    onChangeDOM = (event: *) => this._methods.onChangeDOM(event);
    setMeta = (partialMeta: ParcelMeta) => this._methods.setMeta(partialMeta);
    updateMeta = (updater: ParcelMetaUpdater) => this._methods.updateMeta(updater);
    setChangeRequestMeta = (partialMeta: ParcelMeta) => this._methods.setChangeRequestMeta(partialMeta);
    dispatch = (dispatchable: Action|Action[]|ChangeRequest) => this._methods.dispatch(dispatchable);
    batch = (batcher: ParcelBatcher, changeRequest: ?ChangeRequest) => this._methods.batch(batcher, changeRequest);
    ping = () => this._methods.ping();

    // Parent get methods
    has = (key: Key|Index): boolean => this._methods.has(key);
    get = (key: Key|Index, notFoundValue: ?* = undefined): Parcel => this._methods.get(key, notFoundValue);
    getIn = (keyPath: Array<Key|Index>, notFoundValue: ?* = undefined): Parcel => this._methods.getIn(keyPath, notFoundValue);
    toObject = (mapper: ParcelMapper = _ => _): { [key: string]: * } => this._methods.toObject(mapper);
    toArray = (mapper: ParcelMapper = _ => _): Array<*> => this._methods.toArray(mapper);
    size = (): number => this._methods.size();

    // Parent change methods
    set = (key: Key|Index, value: *) => this._methods.set(key, value);
    update = (key: Key|Index, updater: ParcelValueUpdater) => this._methods.update(key, updater);
    setIn = (keyPath: Array<Key|Index>, value: *) => this._methods.setIn(keyPath, value);
    updateIn = (keyPath: Array<Key|Index>, updater: ParcelValueUpdater) => this._methods.updateIn(keyPath, updater);

    // Indexed methods
    delete = (key: Key|Index) => this._methods.delete(key);
    insertAfter = (key: Key|Index, value: *) => this._methods.insertAfter(key, value);
    insertBefore = (key: Key|Index, value: *) => this._methods.insertBefore(key, value);
    push = (value: *) => this._methods.push(value);
    pop = () => this._methods.pop();
    shift = () => this._methods.shift();
    swap = (keyA: Key|Index, keyB: Key|Index) => this._methods.swap(keyA, keyB);
    swapNext = (key: Key|Index) => this._methods.swapNext(key);
    swapPrev = (key: Key|Index) => this._methods.swapPrev(key);
    unshift = (value: *) => this._methods.unshift(value);

    // Child methods
    deleteSelf = () => this._methods.deleteSelf();

    // Element methods
    insertAfterSelf = (value: *) => this._methods.insertAfterSelf(value);
    insertBeforeSelf = (value: *) => this._methods.insertBeforeSelf(value);
    swapNextWithSelf = () => this._methods.swapNextWithSelf();
    swapPrevWithSelf = () => this._methods.swapPrevWithSelf();
    swapWithSelf = (key: Key|Index) => this._methods.swapWithSelf(key);

    // Modify methods
    modifyValue = (updater: Function): Parcel => this._methods.modifyValue(updater);
    modifyChange = (batcher: Function): Parcel => this._methods.modifyChange(batcher);
    modifyChangeValue = (updater: Function): Parcel => this._methods.modifyChangeValue(updater);
    initialMeta = (initialMeta: ParcelMeta = {}): Parcel => this._methods.initialMeta(initialMeta);
    addModifier = (modifier: ModifierFunction|ModifierObject): Parcel => this._methods.addModifier(modifier);
    addDescendantModifier = (modifier: ModifierFunction|ModifierObject): Parcel => this._methods.addDescendantModifier(modifier);

    // Type methods
    isChild = (): boolean => this._parcelTypes.isChild();
    isElement = (): boolean => this._parcelTypes.isElement();
    isIndexed = (): boolean => this._parcelTypes.isIndexed();
    isParent = (): boolean => this._parcelTypes.isParent();
    isTopLevel = (): boolean => this._parcelTypes.isTopLevel();

    // Advanced methods
    getInternalLocationShareData = (): * => this._methods.getInternalLocationShareData();
    setInternalLocationShareData = (partialData: Object): * => this._methods.setInternalLocationShareData(partialData);
}
