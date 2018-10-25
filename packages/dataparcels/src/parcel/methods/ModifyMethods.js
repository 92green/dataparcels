// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type Parcel from '../Parcel';
import type {ParcelMeta} from '../../types/Types';
import Types from '../../types/Types';

import ParcelTypes from '../ParcelTypes';

import filterNot from 'unmutable/lib/filterNot';
import has from 'unmutable/lib/has';
import isEmpty from 'unmutable/lib/isEmpty';
import merge from 'unmutable/lib/merge';
import set from 'unmutable/lib/set';
import setIn from 'unmutable/lib/setIn';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel): Object => ({

    modifyValue: (updater: Function): Parcel => {
        Types(`modifyValue()`, `updater`, `function`)(updater);

        let value = updater(_this._parcelData.value, _this);

        let newType = new ParcelTypes(value);
        let changedType: boolean = newType.isParent() !== _this._parcelTypes.isParent()
            || newType.isIndexed() !== _this._parcelTypes.isIndexed();

        let onDispatch = changedType
            ? (changeRequest: ChangeRequest) => {
                _this.batch(
                    (parcel: Parcel) => {
                        parcel.set(value);
                        parcel.dispatch(changeRequest);
                    },
                    changeRequest
                );
            }
            : undefined;

        return _this._create({
            id: _this._id.pushModifier('mv'),
            parcelData: {
                ..._this._parcelData,
                value
            },
            onDispatch
        });
    },

    modifyChange: (batcher: Function): Parcel => {
        Types(`modifyChange()`, `batcher`, `function`)(batcher);
        return _this._create({
            id: _this._id.pushModifier('mc'),
            onDispatch: (changeRequest: ChangeRequest) => {
                _this.batch(
                    (parcel: Parcel) => batcher(parcel, changeRequest._setBaseParcel(parcel)),
                    changeRequest
                );
            }
        });
    },

    modifyChangeValue: (updater: Function): Parcel => {
        Types(`modifyChangeValue()`, `updater`, `function`)(updater);
        return _this.modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {

            let valueActionFilter = actions => actions.filter(action => !action.isValueAction());
            parcel.dispatch(changeRequest.updateActions(valueActionFilter));

            pipeWith(
                changeRequest.data.value,
                updater,
                parcel.dangerouslyReplace
            );
        });
    },

    initialMeta: (initialMeta: ParcelMeta = {}): Parcel => {
        Types(`initialMeta()`, `initialMeta`, `object`)(initialMeta);
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
            {
                id: _this._id.pushModifier('im')
            },
            metaSetter,
            _this._create
        );
    },

    _boundarySplit: ({handleChange}: *): Parcel => {
        return _this._create({
            id: _this._id.pushModifier('bs'),
            parent: _this._parent,
            handleChange,
            treeshare: _this._treeshare.boundarySplit()
        });
    }
});
