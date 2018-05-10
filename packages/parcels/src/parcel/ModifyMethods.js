// @flow
import type {
    ModifierFunction,
    ModifierObject
} from '../types/Types';

import Action from '../action/Action';
import strip from '../parcelData/strip';

import isEmpty from 'unmutable/lib/isEmpty';
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
    modify: (updater: Function): Parcel => {
        return updater(_this);
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
                handleChange: (newParcel: Parcel, actions: Action[]) => {
                    _this.batch((parcel: Parcel) => {
                        batcher({
                            parcel,
                            newParcelData: newParcel.raw(),
                            continueChange: () => parcel.dispatch(actions),
                            actions
                        });
                    });
                }
            }),
            _this._create
        );
    },

    initialMeta: (initialMeta: Object): Parcel => {
        let metaSetter: Function = ii => ii;
        if(isEmpty()(_this._parcelData.meta)) {
            metaSetter = pipe(
                setIn(['parcelData', 'meta'], initialMeta),
                set('handleChange', (newParcel: Parcel, actions: Action[]) => {
                    _this.batch((parcel: Parcel) => {
                        parcel.setMeta(initialMeta);
                        parcel.dispatch(actions);
                    });
                })
            );
        }

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
        return pipeWith(
            _this._parcelData,
            parcelData => ({
                parcelData,
                id: _this._id.pushModifier('am'),
                modifiers: _this._modifiers.add(modifier)
            }),
            _this._create
        );
    }
});
