// @flow
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

import {ParcelTypeMethodMismatch} from '../errors/Errors';

import cancel from '../change/cancel';
import ChangeRequest from '../change/ChangeRequest';
import Action from '../change/Action';

import isIndexedValue from '../parcelData/isIndexedValue';
import isParentValue from '../parcelData/isParentValue';
import deleted from '../parcelData/deleted';
import prepUpdater from '../parcelData/prepUpdater';
import setMetaDefault from '../parcelData/setMetaDefault';
import prepareChildKeys from '../parcelData/prepareChildKeys';
import keyOrIndexToKey from '../parcelData/keyOrIndexToKey';
import parcelGet from '../parcelData/get';
import parcelHas from '../parcelData/has';

import filter from 'unmutable/filter';
import has from 'unmutable/has';
import pipeWith from 'unmutable/pipeWith';
import first from 'unmutable/first';
import last from 'unmutable/last';
import clone from 'unmutable/clone';
import map from 'unmutable/map';
import size from 'unmutable/size';
import toArray from 'unmutable/toArray';

import HashString from '../util/HashString';

const doNothing = (ii: any): any => ii;
const escapeKey = (key: string): string => key.replace(/([^\w])/g, "%$1");

const Parent = 'Parent';
const Child = 'Child';
const Indexed = 'Indexed';
const Element = 'Element';

const DEFAULT_CONFIG_INTERNAL = () => ({
    child: undefined,
    dispatchId: '',
    frameMeta: {},
    meta: {},
    rawId: ["^"],
    rawPath: ["^"],
    parent: {
        isIndexed: false,
        isFirstChild: false,
        isLastChild: false
    },
    registry: {},
    updateChangeRequestOnDispatch: doNothing
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

        //
        // method prep
        //

        let fireAction = (type: string, payload: any, keyPath: any) => {
            this._dispatch(new Action({type, keyPath, payload}));
        };

        let onlyType = (type: string, name: string, fn: Function) => {
            // $FlowFixMe
            if(!this[`_is${type}`]) {
                return () => {
                    throw ParcelTypeMethodMismatch(name, type, this.path);
                };
            }
            return fn;
        };

        let fireActionOnlyType = (type: string, name: string, payload: any, keyPath: any) => {
            return onlyType(type, name, () => fireAction(name, payload, keyPath))();
        };

        //
        // public methods
        //

        // Spread Methods

        this.spread = (notFoundValue: any): any => ({
            value: this._getValue(notFoundValue),
            onChange: this.onChange
        });

        this.spreadDOM = (notFoundValue: any): any => ({
            value: this._getValue(notFoundValue),
            onChange: this.onChangeDOM
        });

        this.spreadDOMCheckbox = (notFoundValue: ?boolean): any => ({
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
        this.children = onlyType(Parent, 'children', (mapper: ParcelMapper = doNothing): ParentType<Parcel> => {
            return pipeWith(
                this._parcelData.value,
                clone(),
                map((value, key) => mapper(this.get(key), key, this))
            );
        });

        // Types(`toArray()`, `mapper`, `function`)(mapper);
        this.toArray = onlyType(Parent, 'toArray', (mapper: ParcelMapper = doNothing): Array<Parcel> => {
            return toArray()(this.children(mapper));
        });

        this.metaAsParcel = (key: string): Parcel => {
            return new Parcel({
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

        this.set = (value: any) => fireAction('set', value);

        // Types(`update()`, `updater`, `function`)(updater);
        this.update = (updater: ParcelValueUpdater) => {
            fireAction('setData', prepUpdater(updater)(this._parcelData));
        };

        this.delete = () => fireActionOnlyType(Child, 'delete');

        // Types(`map()`, `updater`, `function`)(updater);
        this.map = (updater: ParcelValueUpdater) => {
            fireActionOnlyType(Parent, 'map', prepUpdater(updater));
        };

        // Advanced change methods

        // Types(`setMeta()`, `partialMeta`, `object`)(partialMeta);
        this.setMeta = (meta: ParcelMeta) => fireAction('setMeta', meta);

        this.dispatch = this._dispatch;

        // Indexed methods

        // Types(`swap()`, `keyA`, `keyIndex`)(keyA);
        // Types(`swap()`, `keyB`, `keyIndex`)(keyB);
        this.insertAfter = (value: any) => fireActionOnlyType(Element, 'insertAfter', value);

        this.insertBefore = (value: any) => fireActionOnlyType(Element, 'insertBefore', value);

        this.push = (...values: Array<any>) => fireActionOnlyType(Indexed, 'push', values);

        this.pop = () => fireActionOnlyType(Indexed, 'pop');

        this.shift = () => fireActionOnlyType(Indexed, 'shift');

        this.swap = (keyA: Key|Index, keyB: Key|Index) => {
            fireActionOnlyType(Indexed, 'swap', keyB, [keyA]);
        };

        this.swapNext = () => fireActionOnlyType(Element, 'swapNext');

        this.swapPrev = () => fireActionOnlyType(Element, 'swapPrev');

        this.unshift = (...values: Array<any>) => fireActionOnlyType(Indexed, 'unshift', values);

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
                if(nextData.value === cancel) {
                    throw new Error('CANCEL');
                }
                return nextData;
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
            updateChangeRequestOnDispatch = doNothing
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

    _setData = (parcelData: ParcelData) => {
        this._dispatch(new Action({
            type: 'setData',
            payload: parcelData
        }));
    };

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
        changeRequest = changeRequest._create({});

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
        let isFirstChild = childIsNotEmpty && first()(child).key === childKey;
        let isLastChild = childIsNotEmpty && last()(child).key === childKey;

        let rawId = [...this._rawId, isIndexed ? childKey : escapeKey(childKey)];
        let rawPath = [...this._rawPath, childKey];

        let childParcel: Parcel = this._create({
            parcelData: childParcelData,
            updateChangeRequestOnDispatch: childOnDispatch,
            rawId,
            rawPath,
            parent: {
                isIndexed,
                isFirstChild,
                isLastChild
            }
        });

        this._childParcelCache[stringKey] = childParcel;
        return childParcel;
    };

    _getValue = (notFoundValue: any): any => {
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
    get value(): * {
        return this._parcelData.value;
    }

    // $FlowFixMe - this doesn't have side effects
    get meta(): * {
        let {meta} = this._parcelData;
        return {...meta};
    }

    // $FlowFixMe - this doesn't have side effects
    get key(): Key {
        return this._getKeyFromRawPath(this._rawPath);
    }

    // $FlowFixMe - this doesn't have side effects
    get id(): string {
        return this._getIdFromRawId(this._rawId);
    }

    // $FlowFixMe - this doesn't have side effects
    get path(): Array<Key> {
        return this._rawPath.slice(1);
    }

    // $FlowFixMe - this doesn't have side effects
    get size(): number {
        return this._isParent ? size()(this.value) : 0;
    }

    // $FlowFixMe - this doesn't have side effects
    get isFirstChild(): boolean {
        return this._isChild ? this._parent.isFirstChild : false;
    }

    // $FlowFixMe - this doesn't have side effects
    get isLastChild(): boolean {
        return this._isChild ? this._parent.isLastChild : false;
    }

    // $FlowFixMe - this doesn't have side effects
    get isOnlyChild(): boolean {
        return this._isChild ? (this._parent.isFirstChild && this._parent.isLastChild) : false;
    }

    get isChild(): boolean {
        return this._isChild;
    }

    get isElement(): boolean {
        return this._isElement;
    }

    get isIndexed(): boolean {
        return this._isIndexed;
    }

    get isParent(): boolean {
        return this._isParent;
    }
}
