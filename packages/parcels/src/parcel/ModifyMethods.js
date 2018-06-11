// @flow
import type {
    ModifierFunction,
    ModifierObject
} from '../types/Types';

import type ChangeRequest from '../change/ChangeRequest';
import strip from '../parcelData/strip';

import filterNot from 'unmutable/lib/filterNot';
import has from 'unmutable/lib/has';
import isEmpty from 'unmutable/lib/isEmpty';
import merge from 'unmutable/lib/merge';
import set from 'unmutable/lib/set';
import setIn from 'unmutable/lib/setIn';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

import type Parcel from './Parcel';

export default (_this: Parcel): Object => ({

    // private methods
    _applyModifiers: (): Parcel => {
        return _this._modifiers.applyTo(_this);
    },

    // modify methods
    modify: (...updaters: Function[]): Parcel => {
        return pipeWith(
            _this,
            ...updaters
        );
    },

    modifyData: (updater: Function): Parcel => {
        return pipeWith(
            _this._parcelData,
            strip(),
            updater,
            parcelData => ({
                parcelData,
                id: _this._id.pushModifier('md')
            }),
            _this._create
        );
    },

    modifyValue: (updater: Function): Parcel => {
        return pipeWith(
            _this._parcelData,
            set('value', updater(_this._parcelData.value, _this)),
            parcelData => ({
                parcelData,
                id: _this._id.pushModifier('mv')
            }),
            _this._create
        );
    },

    modifyChange: (batcher: Function): Parcel => {
        return pipeWith(
            _this._parcelData,
            parcelData => ({
                parcelData,
                id: _this._id.pushModifier('mc'),
                onDispatch: (changeRequest: ChangeRequest) => {
                    _this.batch(
                        (parcel: Parcel) => batcher(parcel, changeRequest.setBase(parcel.data())),
                        changeRequest
                    );
                }
            }),
            _this._create
        );
    },

    initialMeta: (initialMeta: Object = {}): Parcel => {
        let {meta} = _this._parcelData;

        let partialMetaToSet = pipeWith(
            initialMeta,
            filterNot((value, key) => has(key)(meta))
        );

        let metaSetter = isEmpty()(partialMetaToSet)
            ? ii => ii
            : pipe(
                setIn(['parcelData', 'meta'], merge(partialMetaToSet)(meta)),
                set('onDispatch', (changeRequest: ChangeRequest) => {
                    _this.batch((parcel: Parcel) => {
                        parcel.setMeta(partialMetaToSet);
                        parcel.dispatch(changeRequest);
                    });
                })
            );

        return pipeWith(
            _this._parcelData,
            parcelData => ({
                parcelData,
                id: _this._id.pushModifier('im')
            }),
            metaSetter,
            _this._create
        );
    },

    addPreModifier: (modifier: ModifierFunction): Parcel => {
        _this._treeshare.setPreModifier(modifier);
        return modifier(_this);
    },

    addModifier: (modifier: ModifierFunction|ModifierObject): Parcel => {
        return pipeWith(
            modifier,
            _this.addDescendantModifier,
            parcel => parcel._applyModifiers()
        );
    },

    addDescendantModifier: (modifier: ModifierFunction|ModifierObject): Parcel => {
        // explicitly mutate, see https://github.com/blueflag/parcels/issues/43
        _this._modifiers =_this._modifiers.add(modifier);
        return _this;
    }
});
