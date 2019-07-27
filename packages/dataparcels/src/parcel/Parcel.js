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

import ParcelId from '../parcelId/ParcelId';
import isIndexedValue from '../parcelData/isIndexedValue';
import isParentValue from '../parcelData/isParentValue';
import deleted from '../parcelData/deleted';
import prepUpdater from '../parcelData/prepUpdater';
import setMetaDefault from '../parcelData/setMetaDefault';
import prepareChildKeys from '../parcelData/prepareChildKeys';
import keyOrIndexToKey from '../parcelData/keyOrIndexToKey';
import parcelGet from '../parcelData/get';
import parcelHas from '../parcelData/has';

import identity from 'unmutable/lib/identity';
import filterNot from 'unmutable/lib/filterNot';
import has from 'unmutable/lib/has';
import pipeWith from 'unmutable/lib/util/pipeWith';
import first from 'unmutable/lib/first';
import last from 'unmutable/lib/last';
import clone from 'unmutable/lib/clone';
import map from 'unmutable/lib/map';
import size from 'unmutable/lib/size';
import toArray from 'unmutable/lib/toArray';

import HashString from '../util/HashString';
import ValidateValueUpdater from '../util/ValidateValueUpdater';

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

    //
    // private member variables
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

        let onlyType = (type: string, name: string, fn: Function) => {
            // $FlowFixMe
            if(!this[`_is${type}`]) {
                return () => {
                    throw ParcelTypeMethodMismatch(name, type, this.path);
                };
            }
            return fn;
        };

        const Parent = 'Parent';
        const Child = 'Child';
        const Indexed = 'Indexed';
        const Element = 'Element';

        //
        // public methods
        //

        // TODO - compact args
        // TODO - dedupe dispatches
        // TODO - identify

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

        this.has = onlyType(Parent, 'has', (key: Key|Index): boolean => {
            //Types(`has()`, `key`, `keyIndex`)(key);
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
                id: this._id.pushModifier('sc'),
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
            if(updater._asRaw) {
                let updated = updater(this._parcelData);
                this._dispatch(ActionCreators.setData(updated));
                return;
            }

            let {value} = this;
            let updatedValue = updater(value);
            ValidateValueUpdater(value, updatedValue);
            this.set(updatedValue);
        };

        this.delete = onlyType(Child, 'delete', () => this._dispatch(ActionCreators.deleteSelf()));

        // Types(`map()`, `updater`, `function`)(updater);
        this.map = onlyType(Parent, 'map', (updater: ParcelValueUpdater) => {
            this._dispatch(ActionCreators.map(prepUpdater(updater)));
        });

        // Advanced change methods

        // Types(`setMeta()`, `partialMeta`, `object`)(partialMeta);
        this.setMeta = (partialMeta: ParcelMeta) => {
            this._dispatch(ActionCreators.setMeta(partialMeta));
        };

        this.dispatch = this._dispatch;

        // Indexed methods
        this.insertAfter = onlyType(Element, 'insertAfter', (value: any) => {
            this._dispatch(ActionCreators.insertAfterSelf(value));
        });

        this.insertBefore = onlyType(Element, 'insertBefore', (value: any) => {
            this._dispatch(ActionCreators.insertBeforeSelf(value));
        });

        // Types(`move()`, `keyA`, `keyIndex`)(keyA);
        // Types(`move()`, `keyB`, `keyIndex`)(keyB);
        this.move = onlyType(Indexed, 'move', (keyA: Key|Index, keyB: Key|Index) => {
            this._dispatch(ActionCreators.move(keyA, keyB));
        });

        this.push = onlyType(Indexed, 'push', (...values: Array<*>) => {
            this._dispatch(ActionCreators.push(...values));
        });

        this.pop = onlyType(Indexed, 'pop', () => {
            this._dispatch(ActionCreators.pop());
        });

        this.shift = onlyType(Indexed, 'shift', () => {
            this._dispatch(ActionCreators.shift());
        });

        // Types(`swap()`, `keyA`, `keyIndex`)(keyA);
        // Types(`swap()`, `keyB`, `keyIndex`)(keyB);
        this.swap = onlyType(Indexed, 'swap', (keyA: Key|Index, keyB: Key|Index) => {
            this._dispatch(ActionCreators.swap(keyA, keyB));
        });

        this.swapNext = onlyType(Element, 'swapNext', () => {
            this._dispatch(ActionCreators.swapNextSelf());
        });

        this.swapPrev = onlyType(Element, 'swapPrev', () => {
            this._dispatch(ActionCreators.swapPrevSelf());
        });

        this.unshift = onlyType(Indexed, 'unshift', (...values: Array<*>) => {
            this._dispatch(ActionCreators.unshift(...values));
        });

        // Modify methods

        // Types(`modifyDown()`, `updater`, `function`)(updater);
        this.modifyDown = (updater: ParcelValueUpdater): Parcel => {
            let parcelDataUpdater = prepUpdater(updater);
            return this._create({
                id: this._pushModifierId('md', updater),
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
                id: this._pushModifierId('mu', updater),
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
                filterNot((value, key) => has(key)(meta)),
                setMetaDefault
            );

            return this._create({
                id: this._id.pushModifier('im'),
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

        let childParcel: Parcel = this._create({
            parcelData: childParcelData,
            updateChangeRequestOnDispatch: childOnDispatch,
            id: this._id.push(childKey, isIndexed),
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

    _pushModifierId = (prefix: string, updater: ParcelValueUpdater): ParcelId => {
        let hash = (fn: Function): string => `${HashString(fn.toString())}`;
        let id = updater._asRaw
            ? `s${hash(updater._updater || updater)}`
            : hash(updater);

        return this._id.pushModifier(`${prefix}-${id}`);
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

    // //
    // // public methods
    // //

    // // Spread methods
    // spread = (notFoundValue: any = undefined): * => this._methods.spread(notFoundValue);
    // spreadDOM = (notFoundValue: any = undefined): * => this._methods.spreadDOM(notFoundValue);
    // spreadDOMCheckbox = (notFoundValue: boolean = false): * => this._methods.spreadDOMCheckbox(notFoundValue);

    // // Branch methods
    // get = (key: Key|Index, notFoundValue: any = undefined): Parcel => this._methods.get(key, notFoundValue);
    // getIn = (keyPath: Array<Key|Index>, notFoundValue: any = undefined): Parcel => this._methods.getIn(keyPath, notFoundValue);
    // children = (mapper: ParcelMapper = _ => _): ParentType<Parcel> => this._methods.children(mapper);
    // toArray = (mapper: ParcelMapper = _ => _): Array<Parcel> => this._methods.toArray(mapper);
    // metaAsParcel = (key: string): Parcel => this._methods.metaAsParcel(key);

    // // Parent methods
    // has = (key: Key|Index): boolean => this._methods.has(key);
    // size = (): number => this._methods.size();

    // // Child methods
    // isFirst = (): boolean => this._methods.isFirst();
    // isLast = (): boolean => this._methods.isLast();

    // // Side-effect methods
    // spy = (sideEffect: Function): Parcel => this._methods.spy(sideEffect);
    // spyChange = (sideEffect: Function): Parcel => this._methods.spyChange(sideEffect);

    // // Change methods
    // onChange = (value: any) => this._methods.onChange(value);
    // onChangeDOM = (event: *) => this._methods.onChangeDOM(event);
    // onChangeDOMCheckbox = (event: *) => this._methods.onChangeDOMCheckbox(event);
    // set = (value: any) => this._methods.set(value);
    // update = (updater: ParcelValueUpdater) => this._methods.update(updater);
    // delete = () => this._methods.deleteSelf();
    // map = (updater: ParcelValueUpdater) => this._methods.map(updater);

    // // Advanced change methods
    // setMeta = (partialMeta: ParcelMeta) => this._methods.setMeta(partialMeta);
    // dispatch = (dispatchable: Action|Action[]|ChangeRequest) => this._methods.dispatch(dispatchable);

    // // Indexed methods
    // insertAfter = (value: any) => this._methods.insertAfterSelf(value);
    // insertBefore = (value: any) => this._methods.insertBeforeSelf(value);
    // move = (keyA: Key|Index, keyB: Key|Index) => this._methods.move(keyA, keyB);
    // push = (...values: Array<any>) => this._methods.push(...values);
    // pop = () => this._methods.pop();
    // shift = () => this._methods.shift();
    // swap = (keyA: Key|Index, keyB: Key|Index) => this._methods.swap(keyA, keyB);
    // swapNext = () => this._methods.swapNextSelf();
    // swapPrev = () => this._methods.swapPrevSelf();
    // unshift = (...values: Array<any>) => this._methods.unshift(...values);

    // // Modify methods
    // modifyDown = (updater: ParcelValueUpdater): Parcel => this._methods.modifyDown(updater);
    // modifyUp = (updater: ParcelValueUpdater): Parcel => this._methods.modifyUp(updater);
    // initialMeta = (initialMeta: ParcelMeta): Parcel => this._methods.initialMeta(initialMeta);

    // // Type methods
    // isChild = (): boolean => this._isChild;
    // isElement = (): boolean => this._isElement;
    // isIndexed = (): boolean => this._isIndexed;
    // isParent = (): boolean => this._isParent;
    // isTopLevel = (): boolean => !this._isChild;

    // // Composition methods
    // pipe = (...updaters: ParcelUpdater[]): Parcel => this._methods.pipe(...updaters);
}
