// @flow
import type {
    ParcelData,
    ParcelConfig,
    ParcelConfigInternal
} from '../types/Types';
import type Action from '../action/Action';

import ActionMethods from './ActionMethods';
import ChildParcelMethods from './ChildParcelMethods';
import IndexedParcelMethods from './IndexedParcelMethods';
import ModifyMethods from './ModifyMethods';
import ParcelTypes from './ParcelTypes';
import ParentParcelMethods from './ParentParcelMethods';
import ValueParcelMethods from './ValueParcelMethods';

import ParcelId from '../parcelId/ParcelId';
import ParcelRegistry from '../registry/ParcelRegistry';

type CreateParcelConfigType = {
    handleChange?: Function,
    id: ParcelId,
    parcelData: ParcelData,
    parent?: Parcel
};

const DEFAULT_CONFIG_INTERNAL = {
    child: undefined,
    id: new ParcelId(),
    registry: undefined,
    parent: undefined
};

export default class Parcel {

    _handleChange: Function;
    _parcelData: ParcelData;
    _id: ParcelId;
    _registry: ParcelRegistry;
    _actionBuffer: Action[] = [];
    _actionBufferOn: boolean = false;
    _parcelTypes: ParcelTypes;

    _actionMethods: Object;
    _childParcelMethods: Object;
    _indexedParcelMethods: Object;
    _modifyMethods: Object;
    _parentParcelMethods: Object;
    _valueParcelMethods: Object;

    constructor(parcelConfig: ParcelConfig, _parcelConfigInternal: ?ParcelConfigInternal) {
        let {
            handleChange,
            value
        } = parcelConfig;

        let {
            child,
            id,
            registry,
            parent
        } = _parcelConfigInternal || DEFAULT_CONFIG_INTERNAL;

        this._handleChange = handleChange;
        this._parcelData = {
            value,
            child,
            key: id.key()
        };

        // types
        this._parcelTypes = new ParcelTypes(value, parent && parent._parcelTypes);
        this._id = id.setTypeCode(this._parcelTypes.toTypeCode());

        // registry
        this._registry = registry || new ParcelRegistry(); // TODO ParcelTree?
        this._registry.set(id.id(), this);

        // methods
        this._actionMethods = ActionMethods(this);
        this._childParcelMethods = ChildParcelMethods(this);
        this._indexedParcelMethods = IndexedParcelMethods(this);
        this._modifyMethods = ModifyMethods(this);
        this._parentParcelMethods = ParentParcelMethods(this);
        this._valueParcelMethods = ValueParcelMethods(this);
    }

    //
    // private
    //

    _create: Function = (createParcelConfig: CreateParcelConfigType): Parcel => {
        let {
            handleChange = this._handleChange,
            id = this._id,
            parcelData: {
                child,
                value
            },
            parent
        } = createParcelConfig;

        return new Parcel(
            {
                handleChange,
                value
            },
            {
                child,
                id,
                registry: this._registry,
                parent
            }
        );
    };

    _buffer: Function = (...args) => this._actionMethods._buffer(...args);
    _flush: Function = (...args) => this._actionMethods._flush(...args);
    _skipReducer: Function = (...args) => this._actionMethods._skipReducer(...args);
    _typedPathString: Function = () => this._id.typedPathString();

    //
    // public
    //

    // type methods

    isChild: Function = () => this._parcelTypes.isChild();
    isElement: Function = () => this._parcelTypes.isElement();
    isIndexed: Function = () => this._parcelTypes.isIndexed();
    isParent: Function = () => this._parcelTypes.isParent();

    // id methods

    key: Function = () => this._id.key();
    id: Function = () => this._id.id();
    path: Function = () => this._id.path();

    // get methods
    // - value parcel

    raw: Function = (...args) => this._valueParcelMethods.raw(...args);
    data: Function = (...args) => this._valueParcelMethods.data(...args);
    value: Function = (...args) => this._valueParcelMethods.value(...args);
    spread: Function = (...args) => this._valueParcelMethods.spread(...args);
    spreadDOM: Function = (...args) => this._valueParcelMethods.spreadDOM(...args);

    // - parent parcel

    has: Function = (...args) => this._parentParcelMethods.has(...args);
    get: Function = (...args) => this._parentParcelMethods.get(...args);
    getIn: Function = (...args) => this._parentParcelMethods.getIn(...args);
    toObject: Function = (...args) => this._parentParcelMethods.toObject(...args);
    toArray: Function = (...args) => this._parentParcelMethods.toArray(...args);
    size: Function = (...args) => this._parentParcelMethods.size(...args);

    // change methods
    // - value parcel

    dispatch: Function = (...args) => this._actionMethods.dispatch(...args);
    batch: Function = (...args) => this._actionMethods.batch(...args);

    setSelf: Function = (...args) => this._valueParcelMethods.setSelf(...args);
    updateSelf: Function = (...args) => this._valueParcelMethods.updateSelf(...args);
    onChange: Function = (...args) => this._valueParcelMethods.onChange(...args);
    onChangeDOM: Function = (...args) => this._valueParcelMethods.onChangeDOM(...args);

    // - parent parcel

    set: Function = (...args) => this._parentParcelMethods.set(...args);
    setIn: Function = (...args) => this._parentParcelMethods.setIn(...args);
    update: Function = (...args) => this._parentParcelMethods.update(...args);
    updateIn: Function = (...args) => this._parentParcelMethods.updateIn(...args);

    // - indexed parcel

    delete: Function = (...args) => this._indexedParcelMethods.delete(...args);
    insert: Function = (...args) => this._indexedParcelMethods.insert(...args);
    push: Function = (...args) => this._indexedParcelMethods.push(...args);
    pop: Function = (...args) => this._indexedParcelMethods.pop(...args);
    shift: Function = (...args) => this._indexedParcelMethods.shift(...args);
    swap: Function = (...args) => this._indexedParcelMethods.swap(...args);
    swapNext: Function = (...args) => this._indexedParcelMethods.swapNext(...args);
    swapPrev: Function = (...args) => this._indexedParcelMethods.swapPrev(...args);
    unshift: Function = (...args) => this._indexedParcelMethods.unshift(...args);

    // - child parcel

    deleteSelf: Function = (...args) => this._childParcelMethods.deleteSelf(...args);

    // modify methods

    chain: Function = (...args) => this._modifyMethods.chain(...args);
    modify: Function = (...args) => this._modifyMethods.modify(...args);
    modifyValue: Function = (...args) => this._modifyMethods.modifyValue(...args);
    modifyChange: Function = (...args) => this._modifyMethods.modifyChange(...args);
}