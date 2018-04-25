// @flow
import BaseParcel from './BaseParcel';
import ParcelFactory from '../ParcelFactory';

import ParcelRegistry from '../registry/ParcelRegistry';

import Action from '../reducer/Action';
import ActionCreators from '../reducer/ActionCreators';
import Reducer from '../reducer/Reducer';

import stripParcelData from '../util/stripParcelData';

import idPush from '../parcelId/push';
import idModifier from '../parcelId/modifier';
import idFilterModifiers from '../parcelId/filterModifiers';

import set from 'unmutable/lib/set';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default class ValueParcel extends BaseParcel {

    constructor(parcelConfig: ParcelConfig, _parcelConfigInternal: ParcelConfigInternal) {
        super();
        let {
            handleChange,
            value,
            child,
            key
        } = parcelConfig;

        let {
            registry,
            id = "_"
        } = _parcelConfigInternal;

        // from parcel config
        this._handleChange = handleChange;
        this._parcelData = {
            value,
            child,
            key
        };

        // from parcel config internal
        this._id = id;
        this._registry = registry || new ParcelRegistry();
        this._registry.set(id, this);

        // remaining initialization
        this._actionBuffer = [];
        this._actionBufferOn = false;
    }

    //
    // private
    //

    _buffer: Function = () => {
        this._actionBuffer = [];
        this._actionBufferOn = true;
    };

    _flush: Function = () => {
        this._actionBufferOn = false;
        this.dispatch(this._actionBuffer);
        this._actionBuffer = [];
    };

    _create: Function = (createParcelConfig: ParcelConfig): ParcelType => {
        let {
            idAppend,
            id,
            ...partialParcelConfig
        } = createParcelConfig;

        if(idAppend) {
            id = idPush(idAppend)(this._id);
        }

        return ParcelFactory(
            {
                handleChange: this._handleChange,
                ...partialParcelConfig
            },
            {
                registry: this._registry,
                id
            }
        );
    };

    _skipReducer: Function = (handleChange: Function): Function => {
        handleChange.SKIP_REDUCER = true;
        return handleChange;
    };

    _setSelf: Function = (parcelData: ParcelData) => {
        this.dispatch(ActionCreators.set(parcelData));
    };

    _updateSelf: Function  = (updater: Function) => {
        this._setSelf(updater(this.value()));
    };

    //
    // public
    //

    // get methods

    raw: Function = (): ParcelData => {
        return this._parcelData;
    };

    data: Function = (): ParcelData => {
        return stripParcelData(this._parcelData, {stripHandleChange: true});
    };

    value: Function = (): * => {
        return this._parcelData.value;
    };

    // meta: Function = (key: ?string): * => {
    //     const {meta} = this._parcelData;
    //     return key ? meta[key] : meta;
    // };

    key: Function = (): ?Key => {
        return this._parcelData.key;
    };

    spread: Function = (): Object => ({
        value: this.value(),
        onChange: this.onChange
    });

    spreadDOM: Function = (): Object => ({
        value: this.value(),
        onChange: this.onChangeDOM
    });

    // change methods

    dispatch: Function = (action: Action|Action[]) => {
        if(this._actionBufferOn) {
            this._actionBuffer = this._actionBuffer.concat(action);
            this._parcelData = Reducer(this._parcelData, action);
            return;
        }

        let parcelDataFromRegistry = this._registry
            .get(this._id)
            .raw();

        let parcel = null;
        if(!this._handleChange.SKIP_REDUCER) {
            parcel = this._create({
                ...Reducer(parcelDataFromRegistry, action),
                handleChange: this._handleChange,
                id: this._id
            });
        }

        this._handleChange(parcel, [].concat(action));
    };

    batch: Function = (batcher: Function) => {
        this._buffer();
        batcher(this);
        this._flush();
    };

    set: Function  = (parcelData: ParcelData) => {
        this._setSelf(parcelData);
    };

    update: Function  = (updater: Function) => {
        this._updateSelf(updater);
    };

    onChange: Function = (newValue: *) => {
        this.set(newValue);
    };

    onChangeDOM: Function = (event: Object) => {
        this.onChange(event.target.value);
    };

    // metaChange: Function = (key: ?string): Function => {
    //     let metaChange = (newMeta) => pipeWith(
    //         this._parcelData,
    //         set('meta', newMeta),
    //         this.set
    //     );

    //     if(!key) {
    //         return metaChange;
    //     }

    //     return (newMeta) => pipeWith(
    //         this.meta(),
    //         set(key, newMeta),
    //         metaChange
    //     );
    // };

    id: Function = (): string => {
        return this._id;
    };

    pathId: Function = (): string => {
        return idFilterModifiers()(this._id);
    };

    // modify methods

    chain: Function = (updater: Function): ParcelType => {
        return updater(this);
    };

    modify: Function = (updater: Function): ParcelType => {
        return pipeWith(
            this._parcelData,
            stripParcelData,
            updater,
            set('idAppend', idModifier('ud')),
            this._create
        );
    };

    modifyValue: Function = (updater: Function): ParcelType => {
        return pipeWith(
            this._parcelData,
            set('value', updater(this._parcelData.value, this)),
            set('idAppend', idModifier('uv')),
            this._create
        );
    };

    // modifyMeta: Function = overload({
    //     ["1"]: () => (updater: Function): ParcelType => {
    //         return pipeWith(
    //             this._parcelData,
    //             set('meta', updater(get('meta')(this._parcelData), this)),
    //             set('idAppend', idModifier('um')),
    //             this._create
    //         );
    //     },
    //     ["2"]: () => (key: string, updater: Function): ParcelType => {
    //         return pipeWith(
    //             this._parcelData,
    //             setIn(['meta', key], updater(getIn(['meta', key])(this._parcelData), this)),
    //             set('idAppend', idModifier(`um`, key)),
    //             this._create
    //         );
    //     }
    // });

    modifyChange: Function = (batcher: Function): ParcelType => {
        return pipeWith(
            this._parcelData,
            set('handleChange', (newParcel: Parcel, actions: Action[]) => {
                this.batch((parcel: Parcel) => {
                    batcher({
                        parcel,
                        newParcelData: newParcel.data(),
                        apply: () => this.dispatch(actions),
                        actions
                    });
                });
            }),
            set('idAppend', idModifier('ucd')),
            this._create
        );
    };
}
