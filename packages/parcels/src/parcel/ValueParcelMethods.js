// @flow
import type {ParcelData} from '../types/Types';
import Types from '../types/Types';
import type Parcel from './Parcel';
import strip from '../parcelData/strip';
import ChangeRequest from '../change/ChangeRequest';
import ActionCreators from '../change/ActionCreators';

import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel): Object => ({

    // get methods

    /**
     * Mutation is used to request or change data in response to user interaction.
     * When the `onMutate` functions is called the payload is passed through `payloadCreator` and
     * on to its corresponding promise in the EntityApi.
     * The result of this promise is sent to the entity reducer along with a hash of `payloadCreator` as a `resultKey`.
     * The data is normalized, stored in state and then returned to the component. At each stage of the [entity flow]
     * An appropriate `RequestState` is given to the component. This means the component can be sure that the query is
     * fetching/re-fetching, has thrown an error, or has arrived safely.
     *
     * @example
     *
     * // UserDataHocks.js
     * import {UserMutationHock} from './EntityApi';
     * import DeleteUserQuery from './DeleteUserQuery.graphql';
     *
     * export function DeleteUserMutationHock() {
     *    return UserMutationHock(({id}) => {
     *        return {
     *            query: DeleteUserQuery,
     *            variables: {
     *                id
     *            }
     *        }
     *    });
     * }
     *
     * // User.jsx
     * import React from 'react';
     * import {DeleteUserMutationHock} from './UserDataHocks';
     *
     * function User(props) {
     *     const {id, onMutate} = props;
     *     return <Button onClick={() => onMutate(id)}>Delete User</Button>
     * }
     *
     * const withMutation = DeleteUserMutationHock();
     *
     * export default withMutation(User);
     */

    raw: (): ParcelData => {
        return _this._parcelData;
    },

    /**
     *  Data data data
     *
     *  @param {Object} name - A name for the type of entity
     *  @return {ParcelData} Something
     */

    data: (): ParcelData => {
        return pipeWith(
            _this._parcelData,
            strip()
        );
    },

    /**
     * EntityQueryHock
     *
     * QueryHock is used to request data before a component renders.
     * When one of the `updateKeys` on props changes the hock will pass the current props through
     * `queryCreator` and on to its corresponding promise in EntityApi.
     * The result of this promise is sent to the entity reducer along with a hash of `queryCreator` as a `resultKey`.
     *
     * The data is normalized, stored in state and then returned to the component. At each stage of the [entity flow]
     * An appropriate `RequestState` is given to the component. This means the component can be sure that the query is
     * fetching/re-fetching, has thrown an error, or has arrived safely.
     *
     * @kind function
     */

    value: (): * => {
        return _this._parcelData.value;
    },

    spread: (): Object => ({
        value: _this.value(),
        onChange: _this.onChange
    }),

    spreadDOM: (): Object => ({
        value: _this.value(),
        onChange: _this.onChangeDOM
    }),

    meta: (): * => {
        let {meta} = _this._parcelData;
        return {...meta};
    },

    hasDispatched: (): boolean => {
        return _this._treeshare.dispatch.hasPathDispatched(_this.path());
    },

    getInternalLocationShareData: (): Object => {
        return _this._treeshare.locationShare.get(_this.path());
    },

    // change methods

    setSelf: (value: *) => {
        _this.dispatch(ActionCreators.setSelf(value));
    },

    updateSelf: (updater: Function) => {
        Types(`updateSelf() expects param "updater" to be`, `function`)(updater);
        _this.setSelf(updater(_this.value()));
    },

    onChange: (value: *) => {
        _this.setSelf(value);
    },

    onChangeDOM: (event: Object) => {
        Types(`onChangeDOM() expects param "event" to be`, `event`)(event);
        _this.onChange(event.currentTarget.value);
    },

    setMeta: (partialMeta: Object) => {
        Types(`setMeta() expects param "partialMeta" to be`, `object`)(partialMeta);
        _this.dispatch(ActionCreators.setMeta(partialMeta));
    },

    updateMeta: (updater: Function) => {
        Types(`updateMeta() expects param "updater" to be`, `function`)(updater);
        let {meta} = _this._parcelData;
        pipeWith(
            meta,
            updater,
            Types(`updateMeta() expects the result of updater() to be`, `object`),
            _this.setMeta
        );
    },

    setChangeRequestMeta: (partialMeta: Object) => {
        Types(`setChangeRequestMeta() expects param "partialMeta" to be`, `object`)(partialMeta);
        _this.dispatch(new ChangeRequest().setChangeRequestMeta(partialMeta));
    },

    ping: () => {
        _this.dispatch(ActionCreators.ping());
    },

    // mutation methods

    setInternalLocationShareData: (partialData: Object) => {
        Types(`setInternalLocationShareData() expects param "partialData" to be`, `object`)(partialData);
        _this._treeshare.locationShare.set(_this.path(), partialData);
    }
});
