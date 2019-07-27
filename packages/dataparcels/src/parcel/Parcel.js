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
import type {ParcelParent} from '../types/Types';
import type {ParcelRegistry} from '../types/Types';
import type {ParcelUpdater} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';
import type {ParentType} from '../types/Types';

import Types from '../types/Types';
import {ReadOnlyError} from '../errors/Errors';

import ParcelGetMethods from './methods/ParcelGetMethods';
import ParcelChangeMethods from './methods/ParcelChangeMethods';
import ParentGetMethods from './methods/ParentGetMethods';
import ParentChangeMethods from './methods/ParentChangeMethods';
import ChildGetMethods from './methods/ChildGetMethods';
import IndexedChangeMethods from './methods/IndexedChangeMethods';
import ChildChangeMethods from './methods/ChildChangeMethods';
import ElementChangeMethods from './methods/ElementChangeMethods';
import ModifyMethods from './methods/ModifyMethods';

import ActionCreators from '../change/ActionCreators';
import FilterMethods from '../util/FilterMethods';
import ParcelId from '../parcelId/ParcelId';
import isIndexedValue from '../parcelData/isIndexedValue';
import isParentValue from '../parcelData/isParentValue';

import identity from 'unmutable/lib/identity';
import overload from 'unmutable/lib/util/overload';

const DEFAULT_CONFIG_INTERNAL = () => ({
    child: undefined,
    dispatchId: '',
    frameMeta: {},
    meta: {},
    id: new ParcelId(),
    parent: {
        isIndexed: false,
        isChildFirst: false,
        isChildLast: false
    },
    registry: {},
    updateChangeRequestOnDispatch: identity()
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
            child,
            dispatchId,
            frameMeta,
            meta,
            id,
            parent,
            registry,
            updateChangeRequestOnDispatch
        } = _configInternal || DEFAULT_CONFIG_INTERNAL();

        this._frameMeta = frameMeta;
        this._onHandleChange = handleChange;
        this._updateChangeRequestOnDispatch = updateChangeRequestOnDispatch;

        this._parcelData = {
            value,
            child,
            key: id.key(),
            meta
        };

        this._dispatchId = dispatchId;
        this._id = id;
        this._isChild = !(id && id.path().length === 0);
        this._isElement = parent.isIndexed;
        this._isIndexed = isIndexedValue(value);
        this._isParent = isParentValue(value);
        this._parent = parent;
        this._registry = registry;
        this._registry[id.id()] = this;

        // methods
        this._methods = {
            // $FlowFixMe
            ...ParcelGetMethods(this),
            // $FlowFixMe
            ...ParcelChangeMethods(this),
            // $FlowFixMe
            ...ModifyMethods(this),
            // $FlowFixMe
            ...FilterMethods("Parent", ParentGetMethods)(this),
            // $FlowFixMe
            ...FilterMethods("Parent", ParentChangeMethods)(this),
            // $FlowFixMe
            ...FilterMethods("Child", ChildGetMethods)(this),
            // $FlowFixMe
            ...FilterMethods("Child", ChildChangeMethods)(this),
            // $FlowFixMe
            ...FilterMethods("Indexed", IndexedChangeMethods)(this),
            // $FlowFixMe
            ...FilterMethods("Element", ElementChangeMethods)(this)
        };
    }

    //
    // private
    //

    // from constructor
    _childParcelCache: {[key: string]: Parcel} = {};
    _dispatchId: string;
    _id: ParcelId;
    _isChild: boolean;
    _isElement: boolean;
    _isIndexed: boolean;
    _isParent: boolean;
    _frameMeta: {[key: string]: any};
    _methods: {[key: string]: any};
    _onHandleChange: ?Function;
    _parcelData: ParcelData;
    _parent: ParcelParent;
    _registry: ParcelRegistry;
    _updateChangeRequestOnDispatch: Function;

    _create = (createParcelConfig: ParcelCreateConfigType): Parcel => {
        let {
            dispatchId = this._id.id(),
            handleChange,
            id = this._id,
            frameMeta = this._frameMeta,
            parcelData = this._parcelData,
            parent = this._parent,
            registry = this._registry,
            updateChangeRequestOnDispatch = identity()
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
                dispatchId,
                frameMeta,
                meta,
                id,
                parent,
                registry,
                updateChangeRequestOnDispatch
            }
        );
    };

    _createNew = ({value, handleChange}: any): Parcel => new Parcel({value, handleChange});

    _dispatchToParent = (changeRequest: ChangeRequest) => {
        let parcel = this._registry[this._dispatchId];
        if(parcel) {
            parcel.dispatch(changeRequest);
        }
    };

    _changeAndReturn = (changeCatcher: (parcel: Parcel) => void): [Parcel, ?ChangeRequest] => {
        let result;
        let {_onHandleChange} = this;

        // swap out the parcels real _onHandleChange with a spy
        this._onHandleChange = (parcel, changeRequest) => {
            parcel._onHandleChange = _onHandleChange;
            parcel._frameMeta = this._frameMeta;
            result = [parcel, changeRequest];
        };

        changeCatcher(this);
        this._onHandleChange = _onHandleChange;
        if(!result) {
            return [this, undefined];
        }
        return result;
    };

    _boundarySplit = ({handleChange}: *): Parcel => {
        return this._create({
            id: this._id.pushModifier('bs'),
            handleChange
            // temporarily disabling boundary splitting
            // until a more robust solution can be found
            // dispatchId: '%',
            // registry: {
            //     '%': this
            // }
        });
    };

    _setData = (parcelData: ParcelData) => {
        this._methods.dispatch(ActionCreators.setData(parcelData));
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
    spreadDOMCheckbox = (notFoundValue: boolean = false): * => this._methods.spreadDOMCheckbox(notFoundValue);

    // Branch methods
    get = (key: Key|Index, notFoundValue: any = undefined): Parcel => this._methods.get(key, notFoundValue);
    getIn = (keyPath: Array<Key|Index>, notFoundValue: any = undefined): Parcel => this._methods.getIn(keyPath, notFoundValue);
    children = (mapper: ParcelMapper = _ => _): ParentType<Parcel> => this._methods.children(mapper);
    toArray = (mapper: ParcelMapper = _ => _): Array<Parcel> => this._methods.toArray(mapper);
    metaAsParcel = (key: string): Parcel => this._methods.metaAsParcel(key);

    // Parent methods
    has = (key: Key|Index): boolean => this._methods.has(key);
    size = (): number => this._methods.size();

    // Child methods
    isFirst = (): boolean => this._methods.isFirst();
    isLast = (): boolean => this._methods.isLast();

    // Side-effect methods
    spy = (sideEffect: Function): Parcel => this._methods.spy(sideEffect);
    spyChange = (sideEffect: Function): Parcel => this._methods.spyChange(sideEffect);

    // Change methods
    onChange = (value: any) => this._methods.onChange(value);
    onChangeDOM = (event: *) => this._methods.onChangeDOM(event);
    onChangeDOMCheckbox = (event: *) => this._methods.onChangeDOMCheckbox(event);
    set = (value: any) => this._methods.setSelf(value);
    update = (updater: ParcelValueUpdater) => this._methods.updateSelf(updater);
    delete = () => this._methods.deleteSelf();
    map = (updater: ParcelValueUpdater) => this._methods.map(updater);

    // Advanced change methods
    setMeta = (partialMeta: ParcelMeta) => this._methods.setMeta(partialMeta);
    dispatch = (dispatchable: Action|Action[]|ChangeRequest) => this._methods.dispatch(dispatchable);

    // Indexed methods
    insertAfter = (value: any) => this._methods.insertAfterSelf(value);
    insertBefore = (value: any) => this._methods.insertBeforeSelf(value);
    move = (keyA: Key|Index, keyB: Key|Index) => this._methods.move(keyA, keyB);
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
    modifyDown = (updater: ParcelValueUpdater): Parcel => this._methods.modifyDown(updater);
    modifyUp = (updater: ParcelValueUpdater): Parcel => this._methods.modifyUp(updater);
    initialMeta = (initialMeta: ParcelMeta): Parcel => this._methods.initialMeta(initialMeta);

    // Type methods
    isChild = (): boolean => this._isChild;
    isElement = (): boolean => this._isElement;
    isIndexed = (): boolean => this._isIndexed;
    isParent = (): boolean => this._isParent;
    isTopLevel = (): boolean => !this._isChild;

    // Composition methods
    pipe = (...updaters: ParcelUpdater[]): Parcel => this._methods.pipe(...updaters);
}
