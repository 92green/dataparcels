// @flow
import type Action from '../change/Action';
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

import {ReadOnlyError} from '../errors/Errors';
import {ParcelTypeMethodMismatch} from '../errors/Errors';

import {checkCancellation} from '../change/cancel';
import ChangeRequest from '../change/ChangeRequest';
import ActionCreators from '../change/ActionCreators';

import isIndexedValue from '../parcelData/isIndexedValue';
import isParentValue from '../parcelData/isParentValue';
import deleted from '../parcelData/deleted';
import prepUpdater from '../parcelData/prepUpdater';
import setMetaDefault from '../parcelData/setMetaDefault';
import prepareChildKeys from '../parcelData/prepareChildKeys';
import keyOrIndexToKey from '../parcelData/keyOrIndexToKey';
import parcelGet from '../parcelData/get';
import parcelHas from '../parcelData/has';

import identity from 'unmutable/identity';
import filter from 'unmutable/filter';
import has from 'unmutable/has';
import pipe from 'unmutable/pipe';
import pipeWith from 'unmutable/pipeWith';
import first from 'unmutable/first';
import last from 'unmutable/last';
import clone from 'unmutable/clone';
import map from 'unmutable/map';
import size from 'unmutable/size';
import toArray from 'unmutable/toArray';

import HashString from '../util/HashString';

const escapeKey = (key: string): string => key.replace(/([^\w])/g, "%$1");

const DEFAULT_CONFIG_INTERNAL = () => ({
    child: undefined,
    dispatchId: '',
    frameMeta: {},
    meta: {},
    rawId: ["^"],
    rawPath: ["^"],
    parent: {
        isIndexed: false,
        isChildFirst: false,
        isChildLast: false
    },
    registry: {},
    updateChangeRequestOnDispatch: identity()
});

export default class Parcel {

    //
    // private member variables
    //

    // from constructor
    _childParcelCache: {[key: string]: Parcel} = {};
    _dispatchId: string;
    _rawId: string[];
    _rawPath: string[];
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

    //
    // public methods
    //

    // Spread methods
    spread: Function;
    spreadDOM: Function;
    spreadDOMCheckbox: Function;

    // Branch methods
    get: Function;
    getIn: Function;
    children: Function;
    toArray: Function;
    metaAsParcel: Function;

    // Parent methods
    has: Function;
    size: Function;

    // Child methods
    isFirst: Function;
    isLast: Function;

    // Side-effect methods
    spy: Function;
    spyChange: Function;

    // Change methods
    onChange: Function;
    onChangeDOM: Function;
    onChangeDOMCheckbox: Function;
    set: Function;
    update: Function;
    delete: Function;
    map: Function;

    // Advanced change methods
    setMeta: Function;
    dispatch: Function;

    // Indexed methods
    insertAfter: Function;
    insertBefore: Function;
    move: Function;
    push: Function;
    pop: Function;
    shift: Function;
    swap: Function;
    swapNext: Function;
    swapPrev: Function;
    unshift: Function;

    // Modify methods
    modifyDown: Function;
    modifyUp: Function;
    initialMeta: Function;

    // Type methods
    isChild = (): boolean => this._isChild;
    isElement = (): boolean => this._isElement;
    isIndexed = (): boolean => this._isIndexed;
    isParent = (): boolean => this._isParent;
    isTopLevel = (): boolean => !this._isChild;

    // Composition methods
    pipe = (...updaters: ParcelUpdater[]): Parcel => pipeWith(this, ...updaters);

    constructor(config: ParcelConfig = {}, _configInternal: ?ParcelConfigInternal) {
        //Types(`Parcel()`, `config`, `object`)(config);

        let {
            handleChange,
            value
        } = config;

        //handleChange && Types(`Parcel()`, `config.handleChange`, `function`)(handleChange);

        let {
            child,
            dispatchId,
            frameMeta,
            meta,
            rawId,
            rawPath,
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
            key: this._getKeyFromRawPath(rawPath),
            meta
        };

        this._dispatchId = dispatchId;
        this._rawId = rawId;
        this._rawPath = rawPath;
        this._isChild = rawPath.length > 1;
        this._isElement = parent.isIndexed;
        this._isIndexed = isIndexedValue(value);
        this._isParent = isParentValue(value);
        this._parent = parent;
        this._registry = registry;
        this._registry[this._getIdFromRawId(rawId)] = this;

        let onlyType = (type: string, name: string, fn: Function) => {
            // $FlowFixMe
            if(!this[`_is${type}`]) {
                return () => {
                    throw ParcelTypeMethodMismatch(name, type, this.path);
                };
            }
            return fn;
        };

        let dispatchOnlyType = (type: string, name: string, fn: Function) => {
            return onlyType(type, name, (...args) => {
                this._dispatch(fn(...args));
            });
        };

        const Parent = 'Parent';
        const Child = 'Child';
        const Indexed = 'Indexed';
        const Element = 'Element';

        //
        // public methods
        //

        // Spread Methods

        this.spread = (notFoundValue: ?* = undefined): any => ({
            value: this._getValue(notFoundValue),
            onChange: this.onChange
        });

        this.spreadDOM = (notFoundValue: ?* = undefined): any => ({
            value: this._getValue(notFoundValue),
            onChange: this.onChangeDOM
        });

        this.spreadDOMCheckbox = (notFoundValue: ?boolean = false): any => ({
            checked: !!this._getValue(notFoundValue),
            onChange: this.onChangeDOMCheckbox
        });

        // Branch methods

        this.get = onlyType(Parent, 'get', this._get);

        // Types(`getIn()`, `keyPath`, `keyIndexPath`)(keyPath);
        this.getIn = onlyType(Parent, 'getIn', (keyPath: Array<Key|Index>, notFoundValue: any): Parcel => {
            var parcel = this;
            for(let i = 0; i < keyPath.length; i++) {
                parcel = parcel.get(keyPath[i], i < keyPath.length - 1 ? {} : notFoundValue);
            }
            return parcel;
        });

        // Types(`children()`, `mapper`, `function`)(mapper);
        this.children = onlyType(Parent, 'children', (mapper: ParcelMapper = identity()): ParentType<Parcel> => {
            return pipeWith(
                this._parcelData.value,
                clone(),
                map((value, key) => mapper(this.get(key), key, this))
            );
        });

        // Types(`toArray()`, `mapper`, `function`)(mapper);
        this.toArray = onlyType(Parent, 'toArray', (mapper: ParcelMapper = identity()): Array<Parcel> => {
            return toArray()(this.children(mapper));
        });

        this.metaAsParcel = (key: string): Parcel => {
            return this._createNew({
                value: this.meta[key],
                handleChange: ({value}) => this.setMeta({
                    [key]: value
                })
            });
        };

        // Parent methods

        //Types(`has()`, `key`, `keyIndex`)(key);
        this.has = onlyType(Parent, 'has', (key: Key|Index): boolean => {
            this._prepareChildKeys();
            return parcelHas(key)(this._parcelData);
        });

        this.size = onlyType(Parent, 'size', (): number => size()(this.value));

        // Child methods

        this.isFirst = (): boolean => this._parent.isChildFirst;
        this.isLast = (): boolean => this._parent.isChildLast;

        // Side-effect methods

        // Types(`spy()`, `sideEffect`, `function`)(sideEffect);
        this.spy = (sideEffect: Function): Parcel => {
            sideEffect(this);
            return this;
        };

        // Types(`spyChange()`, `sideEffect`, `function`)(sideEffect);
        this.spyChange = (sideEffect: Function): Parcel => {
            return this._create({
                rawId: this._idPushModifier('sc'),
                updateChangeRequestOnDispatch: (changeRequest: ChangeRequest): ChangeRequest => {
                    let basedChangeRequest = changeRequest._create({
                        prevData: this.data
                    });
                    sideEffect(basedChangeRequest);
                    return changeRequest;
                }
            });
        };

        // Change methods

        this.onChange = (value: any) => this.set(value);

        // Types(`onChangeDOM()`, `event`, `event`)(event);
        this.onChangeDOM = (event: Object) => {
            this.set(event.currentTarget.value);
        };

        // Types(`onChangeDOMCheckbox()`, `event`, `event`)(event);
        this.onChangeDOMCheckbox = (event: Object) => {
            this.set(event.currentTarget.checked);
        };

        this.set = (value: any) => this._dispatch(ActionCreators.setSelf(value));

        // Types(`update()`, `updater`, `function`)(updater);
        this.update = (updater: ParcelValueUpdater) => {
            let updated = prepUpdater(updater)(this._parcelData);
            this._dispatch(ActionCreators.setData(updated));
        };

        this.delete = dispatchOnlyType(Child, 'delete', ActionCreators.deleteSelf);

        // Types(`map()`, `updater`, `function`)(updater);
        this.map = dispatchOnlyType(Parent, 'map', pipe(prepUpdater, ActionCreators.map));

        // Advanced change methods

        // Types(`setMeta()`, `partialMeta`, `object`)(partialMeta);
        this.setMeta = (partialMeta: ParcelMeta) => {
            this._dispatch(ActionCreators.setMeta(partialMeta));
        };

        this.dispatch = this._dispatch;

        // Indexed methods

        // Types(`move()`, `keyA`, `keyIndex`)(keyA);
        // Types(`move()`, `keyB`, `keyIndex`)(keyB);
        // Types(`swap()`, `keyA`, `keyIndex`)(keyA);
        // Types(`swap()`, `keyB`, `keyIndex`)(keyB);
        this.insertAfter = dispatchOnlyType(Element, 'insertAfter', ActionCreators.insertAfterSelf);
        this.insertBefore = dispatchOnlyType(Element, 'insertBefore', ActionCreators.insertBeforeSelf);
        this.move = dispatchOnlyType(Indexed, 'move', ActionCreators.move);
        this.push = dispatchOnlyType(Indexed, 'push', ActionCreators.push);
        this.pop = dispatchOnlyType(Indexed, 'pop', ActionCreators.pop);
        this.shift = dispatchOnlyType(Indexed, 'shift', ActionCreators.shift);
        this.swap = dispatchOnlyType(Indexed, 'swap', ActionCreators.swap);
        this.swapNext = dispatchOnlyType(Element, 'swapNext', ActionCreators.swapNextSelf);
        this.swapPrev = dispatchOnlyType(Element, 'swapPrev', ActionCreators.swapPrevSelf);
        this.unshift = dispatchOnlyType(Indexed, 'unshift', ActionCreators.unshift);

        // Modify methods

        // Types(`modifyDown()`, `updater`, `function`)(updater);
        this.modifyDown = (updater: ParcelValueUpdater): Parcel => {
            let parcelDataUpdater = prepUpdater(updater);
            return this._create({
                rawId: this._idPushModifierUpdater('md', updater),
                parcelData: parcelDataUpdater(this._parcelData),
                updateChangeRequestOnDispatch: (changeRequest) => changeRequest._addStep({
                    type: 'md',
                    updater: parcelDataUpdater
                })
            });
        };

        // Types(`modifyUp()`, `updater`, `function`)(updater);
        this.modifyUp = (updater: ParcelValueUpdater): Parcel => {
            let parcelDataUpdater = (parcelData: ParcelData, changeRequest: ChangeRequest): ParcelData => {
                let nextData = prepUpdater(updater)(parcelData, changeRequest);
                return checkCancellation(nextData);
            };

            return this._create({
                rawId: this._idPushModifierUpdater('mu', updater),
                updateChangeRequestOnDispatch: (changeRequest) => changeRequest._addStep({
                    type: 'mu',
                    updater: parcelDataUpdater,
                    changeRequest
                })
            });
        };

        // Types(`initialMeta()`, `initialMeta`, `object`)(initialMeta);
        this.initialMeta = (initialMeta: ParcelMeta): Parcel => {
            let {meta} = this._parcelData;

            let parcelDataUpdater = pipeWith(
                initialMeta,
                filter((value, key) => !has(key)(meta)),
                setMetaDefault
            );

            return this._create({
                rawId: this._idPushModifier('im'),
                parcelData: parcelDataUpdater(this._parcelData),
                updateChangeRequestOnDispatch: (changeRequest) => changeRequest._addStep({
                    type: 'mu',
                    updater: parcelDataUpdater,
                    changeRequest
                })
            });
        };
    }

    //
    // private methods
    //

    _create = (createParcelConfig: ParcelCreateConfigType): Parcel => {
        let {
            dispatchId = this.id,
            handleChange,
            rawId = this._rawId,
            rawPath = this._rawPath,
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
                rawId,
                rawPath,
                parent,
                registry,
                updateChangeRequestOnDispatch
            }
        );
    };

    _createNew = ({value, handleChange}: any): Parcel => new Parcel({value, handleChange});

    _dispatch = (dispatchable: Action|Action[]|ChangeRequest) => {
        // Types(`dispatch()`, `dispatchable`, `dispatchable`)(dispatchable);

        let {
            _updateChangeRequestOnDispatch,
            _onHandleChange
        } = this;

        let changeRequest: ChangeRequest = dispatchable instanceof ChangeRequest
            ? dispatchable
            : new ChangeRequest(dispatchable);

        if(!changeRequest._originId) {
            changeRequest._originId = this.id;
            changeRequest._originPath = this.path;
        }

        // clear changeRequest's cache
        changeRequest = changeRequest._create({
            prevData: undefined,
            nextData: undefined
        });

        if(_onHandleChange) {
            let changeRequestWithBase = changeRequest._create({
                prevData: this.data
            });
            let parcelData = changeRequestWithBase.nextData;

            if(!parcelData) {
                return;
            }

            let parcelWithChangedData = this._create({
                handleChange: _onHandleChange,
                parcelData,
                frameMeta: changeRequest._nextFrameMeta
            });

            _onHandleChange(parcelWithChangedData, changeRequestWithBase);
            return;
        }

        this._dispatchToParent(_updateChangeRequestOnDispatch(changeRequest));
    };

    _dispatchToParent = (changeRequest: ChangeRequest) => {
        let parcel = this._registry[this._dispatchId];
        if(parcel) {
            parcel._dispatch(changeRequest);
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
            rawId: this._idPushModifier('bs'),
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
        this._dispatch(ActionCreators.setData(parcelData));
    };

    _get = (key: Key|Index, notFoundValue: any): Parcel => {
        //Types(`get()`, `key`, `keyIndex`)(key);

        let stringKey: Key = keyOrIndexToKey(key)(this._parcelData);
        let cachedChildParcel: ?Parcel = this._childParcelCache[stringKey];
        if(cachedChildParcel) {
            return cachedChildParcel;
        }

        this._prepareChildKeys();
        let childParcelData = parcelGet(key, notFoundValue)(this._parcelData);

        // this shouldn't happen in reality, but I cant prove that to flow right now
        // and it rightly should be an error
        if(childParcelData.key === undefined) {
            throw new Error();
        }

        let childKey: Key = childParcelData.key;

        let childOnDispatch = (changeRequest) => changeRequest._addStep({
            type: 'get',
            key: childKey
        });

        let {child} = this._parcelData;
        let childIsNotEmpty = size()(child) > 0;
        let isIndexed = this._isIndexed;
        let isChildFirst = childIsNotEmpty && first()(child).key === childKey;
        let isChildLast = childIsNotEmpty && last()(child).key === childKey;

        let rawId = [...this._rawId, isIndexed ? childKey : escapeKey(childKey)];
        let rawPath = [...this._rawPath, childKey];

        let childParcel: Parcel = this._create({
            parcelData: childParcelData,
            updateChangeRequestOnDispatch: childOnDispatch,
            rawId,
            rawPath,
            parent: {
                isIndexed,
                isChildFirst,
                isChildLast
            }
        });

        this._childParcelCache[stringKey] = childParcel;
        return childParcel;
    };

    _getValue = (notFoundValue: *): * => {
        let {value} = this;
        return value === deleted || value === undefined
            ? notFoundValue
            : value;
    };

    _getKeyFromRawPath = (rawPath: string[]): string =>  last()(rawPath);

    _getIdFromRawId = (rawId: string[]): string => rawId.join('.');

    _idPushModifier = (name: string): string[] => {
        return [...this._rawId, `~${name}`];
    };

    _idPushModifierUpdater = (prefix: string, updater: ParcelValueUpdater): string[] => {
        let hash = (fn: Function): string => `${HashString(fn.toString())}`;
        let id = updater._asRaw
            ? `s${hash(updater._updater || updater)}`
            : hash(updater);

        return this._idPushModifier(`${prefix}-${id}`);
    };

    // prepare child keys only once per parcel instance
    // by preparing them and mutating this.parcelData

    _prepareChildKeys = () => {
        if(!this._parcelData.child) {
            this._parcelData = prepareChildKeys()(this._parcelData);
        }
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
        return this._getKeyFromRawPath(this._rawPath);
    }

    // $FlowFixMe - this doesn't have side effects
    set key(value: any) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get id(): string {
        return this._getIdFromRawId(this._rawId);
    }

    // $FlowFixMe - this doesn't have side effects
    set id(value: any) {
        throw ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get path(): Array<Key> {
        return this._rawPath.slice(1);
    }

    // $FlowFixMe - this doesn't have side effects
    set path(value: any) {
        throw ReadOnlyError();
    }
}
