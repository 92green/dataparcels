// @flow
import type Action from '../change/Action';
import type ChangeRequest from '../change/ChangeRequest';
import type {CreateParcelConfigType} from '../types/Types';
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {MatchPipe} from '../types/Types';
import type {ParcelBatcher} from '../types/Types';
import type {ParcelConfigInternal} from '../types/Types';
import type {ParcelConfig} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {ParcelMapper} from '../types/Types';
import type {ParcelMetaUpdater} from '../types/Types';
import type {ParcelMeta} from '../types/Types';
import type {ParcelUpdater} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';

import Types from '../types/Types';
import {ReadOnlyError} from '../errors/Errors';

import ParcelGetMethods from './methods/ParcelGetMethods';
import ParcelChangeMethods from './methods/ParcelChangeMethods';
import ActionMethods from './methods/ActionMethods';
import ParentGetMethods from './methods/ParentGetMethods';
import ParentChangeMethods from './methods/ParentChangeMethods';
import ChildGetMethods from './methods/ChildGetMethods';
import IndexedChangeMethods from './methods/IndexedChangeMethods';
import ChildChangeMethods from './methods/ChildChangeMethods';
import ElementChangeMethods from './methods/ElementChangeMethods';
import ModifyMethods from './methods/ModifyMethods';
import AdvancedMethods from './methods/AdvancedMethods';

import FilterMethods from '../util/FilterMethods';
import ParcelTypes from './ParcelTypes';
import ParcelId from '../parcelId/ParcelId';
import Treeshare from '../treeshare/Treeshare';

import overload from 'unmutable/lib/util/overload';

const DEFAULT_CONFIG_INTERNAL = () => ({
    onDispatch: undefined,
    child: undefined,
    meta: {},
    id: new ParcelId(),
    matchPipes: [],
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

        handleChange && Types(`Parcel() expects param "config.handleChange" to be`, `function`)(handleChange);
        Types(`Parcel() expects param "config.debugRender" to be`, `boolean`)(debugRender);

        let {
            onDispatch,
            child,
            meta,
            id,
            matchPipes,
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

        // parent
        if(parent) {
            // $FlowFixMe
            this._parent = parent;
        }

        // match pipes
        this._matchPipes = matchPipes || [];

        // types
        this._parcelTypes = new ParcelTypes(
            value,
            parent && parent._parcelTypes,
            id
        );

        this._id = id;
        if(!_configInternal || parent) {
            this._id.setTypeCode(this._parcelTypes.toTypeCode());
        }

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
            ...FilterMethods("Child", ChildGetMethods)(this),
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
    _matchPipes: MatchPipe[];
    _treeshare: Treeshare;
    _parcelTypes: ParcelTypes;
    _parent: ?Parcel;
    _dispatchBuffer: ?Function;
    _isFirst: boolean = false;
    _isLast: boolean = false;
    _log: boolean = false;
    _logName: string = "";

    _create = (createParcelConfig: CreateParcelConfigType): Parcel => {
        let {
            id = this._id,
            onDispatch = this.dispatch,
            handleChange,
            matchPipes = this._matchPipes,
            parent,
            parcelData = this._parcelData,
            treeshare = this._treeshare
        } = createParcelConfig;

        let {
            child,
            value,
            meta = {}
        } = parcelData;

        let parcel: Parcel = new Parcel(
            {
                value,
                handleChange
            },
            {
                child,
                meta,
                id,
                matchPipes,
                onDispatch,
                parent,
                treeshare
            }
        );

        return parent
            ? parcel._methods._applyMatchPipes()
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
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get value(): * {
        return this._parcelData.value;
    }

    // $FlowFixMe - this doesn't have side effects
    set value(value: *) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get meta(): * {
        let {meta = {}} = this._parcelData;
        return {...meta};
    }

    // $FlowFixMe - this doesn't have side effects
    set meta(value: *) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get key(): Key {
        return this._id.key();
    }

    // $FlowFixMe - this doesn't have side effects
    set key(value: *) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get id(): string {
        return this._id.id();
    }

    // $FlowFixMe - this doesn't have side effects
    set id(value: *) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get path(): Array<Key> {
        return this._id.path();
    }

    // $FlowFixMe - this doesn't have side effects
    set path(value: *) {
        throw ReadOnlyError();
    }

    //
    // public methods
    //

    // Spread methods
    spread = (): * => this._methods.spread();
    spreadDOM = (): * => this._methods.spreadDOM();

    // Branch methods
    get = (key: Key|Index, notFoundValue: ?* = undefined): Parcel => this._methods.get(key, notFoundValue);
    getIn = (keyPath: Array<Key|Index>, notFoundValue: ?* = undefined): Parcel => this._methods.getIn(keyPath, notFoundValue);
    toObject = (mapper: ParcelMapper = _ => _): { [key: string]: * } => this._methods.toObject(mapper);
    toArray = (mapper: ParcelMapper = _ => _): Array<*> => this._methods.toArray(mapper);

    // Parent methods
    has = (key: Key|Index): boolean => this._methods.has(key);
    size = (): number => this._methods.size();

    // Child methods
    isFirst = (): boolean => this._methods.isFirst();
    isLast = (): boolean => this._methods.isLast();

    // Status methods
    hasDispatched = (): boolean => this._methods.hasDispatched();

    // Side-effect methods
    log = (name: string = ""): Parcel => this._methods.log(name);
    spy = (sideEffect: Function): Parcel => this._methods.spy(sideEffect);
    spyChange = (sideEffect: Function): Parcel => this._methods.spyChange(sideEffect);

    // Change methods
    onChange = (value: *) => this._methods.onChange(value);
    onChangeDOM = (event: *) => this._methods.onChangeDOM(event);
    set = overload({
        ["1"]: (value: *) => this._methods.setSelf(value),
        ["2"]: (key: Key|Index, value: *) => this._methods.set(key, value)
    });
    update = overload({
        ["1"]: (updater: ParcelValueUpdater) => this._methods.updateSelf(updater),
        ["2"]: (key: Key|Index, updater: ParcelValueUpdater) => this._methods.update(key, updater)
    });
    setIn = (keyPath: Array<Key|Index>, value: *) => this._methods.setIn(keyPath, value);
    updateIn = (keyPath: Array<Key|Index>, updater: ParcelValueUpdater) => this._methods.updateIn(keyPath, updater);
    delete = overload({
        ["0"]: () => this._methods.deleteSelf(),
        ["1"]: (key: Key|Index) => this._methods.delete(key)
    });
    deleteIn = (keyPath: Array<Key|Index>) => this._methods.deleteIn(keyPath);

    // Advanced change methods
    setMeta = (partialMeta: ParcelMeta) => this._methods.setMeta(partialMeta);
    updateMeta = (updater: ParcelMetaUpdater) => this._methods.updateMeta(updater);
    setChangeRequestMeta = (partialMeta: ParcelMeta) => this._methods.setChangeRequestMeta(partialMeta);
    dispatch = (dispatchable: Action|Action[]|ChangeRequest) => this._methods.dispatch(dispatchable);
    batch = (batcher: ParcelBatcher, changeRequest: ?ChangeRequest) => this._methods.batch(batcher, changeRequest);
    ping = () => this._methods.ping();
    dangerouslyReplace = (value: *) => this._methods.dangerouslyReplace(value);

    // Indexed methods
    insertAfter = overload({
        ["1"]: (value: *) => this._methods.insertAfterSelf(value),
        ["2"]: (key: Key|Index, value: *) => this._methods.insertAfter(key, value)
    });
    insertBefore = overload({
        ["1"]: (value: *) => this._methods.insertBeforeSelf(value),
        ["2"]: (key: Key|Index, value: *) => this._methods.insertBefore(key, value)
    });
    push = (value: *) => this._methods.push(value);
    pop = () => this._methods.pop();
    shift = () => this._methods.shift();
    swap = overload({
        ["1"]: (key: Key|Index) => this._methods.swapSelf(key),
        ["2"]: (keyA: Key|Index, keyB: Key|Index) => this._methods.swap(keyA, keyB)
    });
    swapNext = overload({
        ["0"]: () => this._methods.swapNextSelf(),
        ["1"]: (key: Key|Index) => this._methods.swapNext(key)
    });
    swapPrev = overload({
        ["0"]: () => this._methods.swapPrevSelf(),
        ["1"]: (key: Key|Index) => this._methods.swapPrev(key)
    });
    unshift = (value: *) => this._methods.unshift(value);

    // Modify methods
    modifyValue = (updater: Function): Parcel => this._methods.modifyValue(updater);
    modifyChange = (batcher: Function): Parcel => this._methods.modifyChange(batcher);
    modifyChangeValue = (updater: Function): Parcel => this._methods.modifyChangeValue(updater);
    initialMeta = (initialMeta: ParcelMeta = {}): Parcel => this._methods.initialMeta(initialMeta);
    _boundarySplit = (config: *): Parcel => this._methods._boundarySplit(config);

    // Type methods
    isChild = (): boolean => this._parcelTypes.isChild();
    isElement = (): boolean => this._parcelTypes.isElement();
    isIndexed = (): boolean => this._parcelTypes.isIndexed();
    isParent = (): boolean => this._parcelTypes.isParent();
    isTopLevel = (): boolean => this._parcelTypes.isTopLevel();

    // Composition methods
    pipe = (...updaters: ParcelUpdater[]): Parcel => this._methods.pipe(...updaters);
    matchPipe = (match: string, ...updaters: ParcelUpdater[]): Parcel => this._methods.matchPipe(match, ...updaters);

    // Advanced methods
    getInternalLocationShareData = (): * => this._methods.getInternalLocationShareData();
    setInternalLocationShareData = (partialData: Object): * => this._methods.setInternalLocationShareData(partialData);
}
