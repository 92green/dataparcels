// @flow
import type Action from '../change/Action';
import type ChangeRequest from '../change/ChangeRequest';
import type {ParcelCreateConfigType} from '../types/Types';
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelConfigInternal} from '../types/Types';
import type {ParcelConfig} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {ParcelMapper} from '../types/Types';
import type {ParcelMeta} from '../types/Types';
import type {ParcelUpdater} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';
import type {ParentType} from '../types/Types';
import type {ParcelShapeUpdateFunction} from '../types/Types';
import type {ParcelRegistry} from '../types/Types';

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

import FilterMethods from '../util/FilterMethods';
import ParcelTypes from './ParcelTypes';
import ParcelId from '../parcelId/ParcelId';
import setSelf from '../parcelData/setSelf';

import overload from 'unmutable/lib/util/overload';

const DEFAULT_CONFIG_INTERNAL = () => ({
    onDispatch: undefined,
    child: undefined,
    lastOriginId: '',
    meta: {},
    id: new ParcelId(),
    parent: undefined,
    registry: {}
});

export default class Parcel {
    constructor(config: ParcelConfig = {}, _configInternal: ?ParcelConfigInternal) {
        Types(`Parcel()`, `config`, `object`)(config);

        let {
            handleChange,
            value
        } = config;

        handleChange && Types(`Parcel()`, `config.handleChange`, `function`)(handleChange);

        let {
            onDispatch,
            child,
            lastOriginId,
            meta,
            id,
            parent,
            registry
        } = _configInternal || DEFAULT_CONFIG_INTERNAL();

        this._lastOriginId = lastOriginId;
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

        // types
        this._parcelTypes = new ParcelTypes(
            value,
            parent && parent._parcelTypes,
            !!(id && id.path().length === 0)
        );

        // id
        this._id = id;

        // registry
        this._registry = registry;
        this._registry[id.id()] = this;

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
            ...ModifyMethods(this)
        };
    }

    //
    // private
    //

    // from constructor
    _id: ParcelId;
    _lastOriginId: string;
    _methods: { [key: string]: * };
    _onHandleChange: ?Function;
    _onDispatch: ?Function;
    _parcelData: ParcelData;
    _parcelTypes: ParcelTypes;
    _parent: ?Parcel;
    _registry: ParcelRegistry;

    // from methods
    _log: boolean = false; // used by log()
    _logName: string = ""; // used by log()

    _create = (createParcelConfig: ParcelCreateConfigType): Parcel => {
        let {
            handleChange,
            id = this._id,
            lastOriginId = this._lastOriginId,
            onDispatch = this.dispatch,
            parent,
            parcelData = this._parcelData,
            registry = this._registry
        } = createParcelConfig;

        let {
            child,
            value,
            meta = {}
        } = parcelData;

        return new Parcel(
            {
                value,
                handleChange
            },
            {
                child,
                lastOriginId,
                meta,
                id,
                onDispatch,
                parent,
                registry
            }
        );
    };

    _setAndReturn = (value: any): Parcel => {
        // $FlowFixMe
        return this._create({
            handleChange: this._onHandleChange,
            parcelData: setSelf(value)(this._parcelData)
        });
    };

    _boundarySplit = ({handleChange}: *): Parcel => {
        return this._create({
            id: this._id.pushModifier('bs'),
            parent: this._parent,
            handleChange,
            registry: {}
        });
    };

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
    get value(): * {
        return this._parcelData.value;
    }

    // $FlowFixMe - this doesn't have side effects
    set value(value: any) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get meta(): * {
        let {meta = {}} = this._parcelData;
        return {...meta};
    }

    // $FlowFixMe - this doesn't have side effects
    set meta(value: any) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get key(): Key {
        return this._id.key();
    }

    // $FlowFixMe - this doesn't have side effects
    set key(value: any) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get id(): string {
        return this._id.id();
    }

    // $FlowFixMe - this doesn't have side effects
    set id(value: any) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get path(): Array<Key> {
        return this._id.path();
    }

    // $FlowFixMe - this doesn't have side effects
    set path(value: any) {
        throw ReadOnlyError();
    }

    //
    // public methods
    //

    // Spread methods
    spread = (notFoundValue: any = undefined): * => this._methods.spread(notFoundValue);
    spreadDOM = (notFoundValue: any = undefined): * => this._methods.spreadDOM(notFoundValue);

    // Branch methods
    get = (key: Key|Index, notFoundValue: any = undefined): Parcel => this._methods.get(key, notFoundValue);
    getIn = (keyPath: Array<Key|Index>, notFoundValue: any = undefined): Parcel => this._methods.getIn(keyPath, notFoundValue);
    children = (mapper: ParcelMapper = _ => _): ParentType<Parcel> => this._methods.children(mapper);
    toObject = (mapper: ParcelMapper = _ => _): { [key: string]: Parcel } => this._methods.toObject(mapper);
    toArray = (mapper: ParcelMapper = _ => _): Array<Parcel> => this._methods.toArray(mapper);

    // Parent methods
    has = (key: Key|Index): boolean => this._methods.has(key);
    size = (): number => this._methods.size();

    // Child methods
    isFirst = (): boolean => this._methods.isFirst();
    isLast = (): boolean => this._methods.isLast();

    // Side-effect methods
    log = (name: string = ""): Parcel => this._methods.log(name);
    spy = (sideEffect: Function): Parcel => this._methods.spy(sideEffect);
    spyChange = (sideEffect: Function): Parcel => this._methods.spyChange(sideEffect);

    // Change methods
    onChange = (value: any) => this._methods.onChange(value);
    onChangeDOM = (event: *) => this._methods.onChangeDOM(event);
    set = overload({
        ["1"]: (value: any) => this._methods.setSelf(value),
        ["2"]: (key: Key|Index, value: any) => this._methods.set(key, value)
    });
    update = overload({
        ["1"]: (updater: ParcelValueUpdater|ParcelShapeUpdateFunction) => this._methods.updateSelf(updater),
        ["2"]: (key: Key|Index, updater: ParcelValueUpdater|ParcelShapeUpdateFunction) => this._methods.update(key, updater)
    });
    setIn = (keyPath: Array<Key|Index>, value: any) => this._methods.setIn(keyPath, value);
    updateIn = (keyPath: Array<Key|Index>, updater: ParcelValueUpdater) => this._methods.updateIn(keyPath, updater);
    delete = overload({
        ["0"]: () => this._methods.deleteSelf(),
        ["1"]: (key: Key|Index) => this._methods.delete(key)
    });
    deleteIn = (keyPath: Array<Key|Index>) => this._methods.deleteIn(keyPath);

    // Advanced change methods
    setMeta = (partialMeta: ParcelMeta) => this._methods.setMeta(partialMeta);
    dispatch = (dispatchable: Action|Action[]|ChangeRequest) => this._methods.dispatch(dispatchable);

    // Indexed methods
    insertAfter = overload({
        ["1"]: (value: any) => this._methods.insertAfterSelf(value),
        ["2"]: (key: Key|Index, value: any) => this._methods.insertAfter(key, value)
    });
    insertBefore = overload({
        ["1"]: (value: any) => this._methods.insertBeforeSelf(value),
        ["2"]: (key: Key|Index, value: any) => this._methods.insertBefore(key, value)
    });
    move = overload({
        ["1"]: (key: Key|Index) => this._methods.moveSelf(key),
        ["2"]: (keyA: Key|Index, keyB: Key|Index) => this._methods.move(keyA, keyB)
    });
    push = (...values: Array<any>) => this._methods.push(...values);
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
    unshift = (...values: Array<any>) => this._methods.unshift(...values);

    // Modify methods
    modifyDown = (updater: ParcelValueUpdater|ParcelShapeUpdateFunction): Parcel => this._methods.modifyDown(updater);
    modifyUp = (updater: ParcelValueUpdater|ParcelShapeUpdateFunction): Parcel => this._methods.modifyUp(updater);
    initialMeta = (initialMeta: ParcelMeta): Parcel => this._methods.initialMeta(initialMeta);

    // Type methods
    isChild = (): boolean => this._parcelTypes.isChild();
    isElement = (): boolean => this._parcelTypes.isElement();
    isIndexed = (): boolean => this._parcelTypes.isIndexed();
    isParent = (): boolean => this._parcelTypes.isParent();
    isTopLevel = (): boolean => this._parcelTypes.isTopLevel();

    // Composition methods
    pipe = (...updaters: ParcelUpdater[]): Parcel => this._methods.pipe(...updaters);

    // Debug methods
    toConsole = () => this._methods.toConsole();
}
