// @flow
import type {CreateParcelNodeConfigType} from '../types/Types';
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {ParcelNodeConfig} from '../types/Types';
import type {ParcelNodeConfigInternal} from '../types/Types';
import type {ParcelNodeMapper} from '../types/Types';

import Types from '../types/Types';
import {ReadOnlyError} from '../errors/Errors';

import ParcelNodeParentGetMethods from './methods/ParcelNodeParentGetMethods';

import FilterMethods from '../util/FilterMethods';
import ParcelTypes from '../parcel/ParcelTypes';
import ChangeRequest from '../change/ChangeRequest';
import ParcelId from '../parcelId/ParcelId';

const DEFAULT_CONFIG_INTERNAL = () => ({
    changeRequest: new ChangeRequest(),
    parent: undefined
});

export default class ParcelNode {

    constructor(config: ParcelNodeConfig, _configInternal: ?ParcelNodeConfigInternal) {
        Types(`ParcelNode() expects param "config" to be`, `object`)(config);

        let {
            parcelData,
            id
        } = config;

        let {
            changeRequest,
            parent
        } = _configInternal || DEFAULT_CONFIG_INTERNAL();

        this._parcelData = parcelData;
        this._id = id;
        this._changeRequest = changeRequest;

        // types
        this._parcelTypes = new ParcelTypes(
            parcelData.value,
            parent && parent._parcelTypes,
            id
        );

        // methods
        this._methods = {
            // $FlowFixMe
            ...FilterMethods("Parent", ParcelNodeParentGetMethods)(this)
            // $FlowFixMe
            // ...ParcelChangeMethods(this, dispatch),
            // $FlowFixMe
            // ...MethodCreator("Parent", ParentChangeMethods)(this, dispatch),
            // // $FlowFixMe
            // ...MethodCreator("Indexed", IndexedChangeMethods)(this, dispatch),
            // // $FlowFixMe
            // ...MethodCreator("Child", ChildChangeMethods)(this, dispatch),
            // // $FlowFixMe
            // ...MethodCreator("Element", ElementChangeMethods)(this, dispatch)
        };
    }

    //
    // private
    //

    _methods: { [key: string]: * };
    _parcelData: ParcelData;
    _id: ParcelId;
    _changeRequest: ChangeRequest;
    _parcelTypes: ParcelTypes;

    _create = (createParcelConfig: CreateParcelNodeConfigType): ParcelNode => {
        let {
            id = this._id,
            parcelData,
            parent
        } = createParcelConfig;

        return new ParcelNode(
            {
                parcelData,
                id
            },
            {
                changeRequest: this._changeRequest,
                parent
            }
        );
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
        ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get value(): * {
        return this._parcelData.value;
    }

    // $FlowFixMe - this doesn't have side effects
    set value(value: *) {
        ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get meta(): * {
        let {meta} = this._parcelData;
        return {...meta};
    }

    // $FlowFixMe - this doesn't have side effects
    set meta(value: *) {
        ReadOnlyError();
    }

    // $FlowFixMe - this doesn't have side effects
    get key(): Key {
        return this._id.key();
    }

    // $FlowFixMe - this doesn't have side effects
    set key(value: *) {
        ReadOnlyError();
    }

    //
    // public methods
    //

    // Parent get methods
    has = (key: Key|Index): boolean => this._methods.has(key);
    get = (key: Key|Index, notFoundValue: ?* = undefined): ParcelNode => this._methods.get(key, notFoundValue);
    getIn = (keyPath: Array<Key|Index>, notFoundValue: ?* = undefined): ParcelNode => this._methods.getIn(keyPath, notFoundValue);
    toObject = (mapper: ParcelNodeMapper = _ => _): { [key: string]: * } => this._methods.toObject(mapper);
    toArray = (mapper: ParcelNodeMapper = _ => _): Array<*> => this._methods.toArray(mapper);
    size = (): number => this._methods.size();

    // Type methods
    isChild = (): boolean => this._parcelTypes.isChild();
    isElement = (): boolean => this._parcelTypes.isElement();
    isIndexed = (): boolean => this._parcelTypes.isIndexed();
    isParent = (): boolean => this._parcelTypes.isParent();
    isTopLevel = (): boolean => this._parcelTypes.isTopLevel();
}
