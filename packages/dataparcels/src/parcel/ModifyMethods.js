// @flow
import Types from '../types/Types';
import type {ModifierFunction, ModifierObject} from '../types/Types';

import type ChangeRequest from '../change/ChangeRequest';

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

    // modify methods
    modifyValue: (updater: Function): Parcel => {
        Types(`modifyValue() expects param "updater" to be`, `function`)(updater);
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
        Types(`modifyChange() expects param "batcher" to be`, `function`)(batcher);
        return pipeWith(
            _this._parcelData,
            parcelData => ({
                parcelData,
                id: _this._id.pushModifier('mc'),
                onDispatch: (changeRequest: ChangeRequest) => {
                    _this.batch(
                        (parcel: Parcel) => batcher(parcel, changeRequest._setBaseParcel(parcel)),
                        changeRequest
                    );
                }
            }),
            _this._create
        );
    },

    modifyChangeValue: (updater: Function): Parcel => {
        Types(`modifyChangeValue() expects param "updater" to be`, `function`)(updater);
        return _this.modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {

            let valueActionFilter = actions => actions.filter(action => !action.isValueAction());
            parcel.dispatch(changeRequest.updateActions(valueActionFilter));

            pipeWith(
                changeRequest.data.value,
                updater,
                parcel.onChange
            );
        });
    },

    initialMeta: (initialMeta: Object = {}): Parcel => {
        Types(`initialMeta() expects param "initialMeta" to be`, `object`)(initialMeta);
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

    addModifier: (modifier: ModifierFunction|ModifierObject): Parcel => {
        Types(`addModifier() expects param "modifier" to be`, `modifier`)(modifier);
        return pipeWith(
            modifier,
            _this.addDescendantModifier,
            parcel => parcel._applyModifiers()
        );
    },

    addDescendantModifier: (modifier: ModifierFunction|ModifierObject): Parcel => {
        Types(`addDescendantModifier() expects param "modifier" to be`, `modifier`)(modifier);
        // explicitly mutate, see https://github.com/blueflag/parcels/issues/43
        _this._modifiers =_this._modifiers.add(modifier);
        return _this;
    }
});
