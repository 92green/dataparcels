// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type Parcel from '../Parcel';
import type {ParcelMeta} from '../../types/Types';
import type {ParcelValueUpdater} from '../../types/Types';
import type {ParcelShapeUpdater} from '../../types/Types';

import Types from '../../types/Types';
import ParcelShape from '../../parcelShape/ParcelShape';
import ValidateValueUpdater from '../../util/ValidateValueUpdater';
import {ShapeUpdaterUndefinedError} from '../../errors/Errors';

import ParcelTypes from '../ParcelTypes';
import HashString from '../../util/HashString';

import filterNot from 'unmutable/lib/filterNot';
import has from 'unmutable/lib/has';
import isEmpty from 'unmutable/lib/isEmpty';
import merge from 'unmutable/lib/merge';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

let HashFunction = (fn: Function): string => `${HashString(fn.toString())}`;

export default (_this: Parcel): Object => ({

    modifyDown: (updater: ParcelValueUpdater): Parcel => {
        Types(`modifyDown()`, `updater`, `function`)(updater);

        let {value} = _this._parcelData;
        let updatedValue = updater(value, _this);
        ValidateValueUpdater(value, updatedValue);

        let updatedType = new ParcelTypes(updatedValue);
        let updatedTypeChanged: boolean = updatedType.isParent() !== _this._parcelTypes.isParent()
            || updatedType.isIndexed() !== _this._parcelTypes.isIndexed();

        let onDispatch;
        if(updatedTypeChanged) {
            onDispatch = (changeRequest: ChangeRequest) => {
                _this.batch(
                    (parcel: Parcel) => {
                        parcel.set(updatedValue);
                        parcel.dispatch(changeRequest);
                    },
                    changeRequest
                );
            };
        }

        return _this._create({
            id: _this._id.pushModifier(`mv-${HashFunction(updater)}`),
            parcelData: {
                ..._this._parcelData,
                value: updatedValue
            },
            onDispatch
        });
    },

    modifyUp: (updater: ParcelValueUpdater): Parcel => {
        Types(`modifyUp()`, `updater`, `function`)(updater);
        return _this.modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {

            let {value} = changeRequest.nextData;
            let updatedValue = updater(value, _this);
            ValidateValueUpdater(value, updatedValue);

            // dispatch all non-value actions in this change request
            let valueActionFilter = actions => actions.filter(action => !action.isValueAction());
            parcel.dispatch(changeRequest.updateActions(valueActionFilter));

            parcel.set(updatedValue);
        });
    },

    modifyShapeDown: (updater: ParcelShapeUpdater): Parcel => {
        Types(`modifyShapeDown()`, `updater`, `function`)(updater);

        let shapeUpdater = ParcelShape._updateFromData(updater);

        return _this._create({
            id: _this._id.pushModifier(`md-${HashFunction(updater)}`),
            parcelData: shapeUpdater(_this._parcelData),
            onDispatch: (changeRequest: ChangeRequest) => {
                _this.dispatch(changeRequest._addPre(shapeUpdater));
            }
        });
    },

    modifyShapeUp: (updater: ParcelShapeUpdater): Parcel => {
        Types(`modifyShapeUp()`, `updater`, `function`)(updater);

        let shapeUpdater = ParcelShape._updateFromDataUnlessUndefined(updater);

        return _this._create({
            id: _this._id.pushModifier(`mu-${HashFunction(updater)}`),
            onDispatch: (changeRequest: ChangeRequest) => {
                let changeRequestWithBase = changeRequest._setBaseParcel(_this);
                try {
                    shapeUpdater(changeRequestWithBase.nextData);
                    _this.dispatch(changeRequest._addPost(shapeUpdater));
                } catch(e) {
                    if(e.message !== ShapeUpdaterUndefinedError().message) {
                        throw e;
                    }
                }
            }
        });
    },

    modifyChange: (batcher: Function): Parcel => {
        Types(`modifyChange()`, `batcher`, `function`)(batcher);
        return _this._create({
            id: _this._id.pushModifier(`mcb-${HashFunction(batcher)}`),
            onDispatch: (changeRequest: ChangeRequest) => {
                _this.batch(
                    (parcel: Parcel) => batcher(parcel, changeRequest._setBaseParcel(parcel)),
                    changeRequest
                );
            }
        });
    },

    initialMeta: (initialMeta: ParcelMeta): Parcel => {
        Types(`initialMeta()`, `initialMeta`, `object`)(initialMeta);
        let {meta} = _this._parcelData;

        let partialMetaToSet: {[key: string]: any} = pipeWith(
            initialMeta,
            filterNot((value, key) => has(key)(meta))
        );

        let create = (other = {}) => _this._create({
            id: _this._id.pushModifier('im'),
            ...other
        });

        if(isEmpty()(partialMetaToSet)) {
            return create();
        }

        return create({
            parcelData: pipeWith(
                _this._parcelData,
                update('meta', merge(partialMetaToSet))
            ),
            onDispatch: (changeRequest: ChangeRequest) => {
                _this.batch((parcel: Parcel) => {
                    parcel.setMeta(partialMetaToSet);
                    parcel.dispatch(changeRequest);
                });
            }
        });
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
