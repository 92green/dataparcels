// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type Parcel from '../../parcel/Parcel';
import type {ParcelUpdater} from '../../types/Types';
import type {MatchPipe} from '../../types/Types';

import Types from '../../types/Types';
import Matcher from '../../match/Matcher';

import map from 'unmutable/lib/map';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel) => ({

    // Spread Methods

    spread: (): Object => ({
        value: _this.value,
        onChange: _this.onChange
    }),

    spreadDOM: (): Object => ({
        value: _this.value,
        onChange: _this.onChangeDOM
    }),

    // Composition methods

    pipe: (...updaters: ParcelUpdater[]): Parcel => {
        updaters.forEach(Types(`pipe()`, `all updaters`, `function`));
        return pipeWith(
            _this,
            ...pipeWith(
                updaters,
                map(updater => pipe(
                    updater,
                    Types(`pipe()`, `the result of all functions`, `parcel`)
                ))
            )
        );
    },

    matchPipe: (match: string, ...updaters: ParcelUpdater[]): Parcel => {
        Types(`matchPipe()`, `first param`, `string`)(match);
        updaters.forEach(Types(`matchPipe()`, `all updaters`, `function`));

        let parcel = _this._create({
            id: _this._id.pushModifier('mp'),
            matchPipes: [
                ..._this._matchPipes,
                {
                    depth: _this.path.length,
                    match,
                    updater: pipe(
                        ...pipeWith(
                            updaters,
                            map(updater => pipe(
                                updater,
                                Types(`matchPipe() `, `the result of all functions`, `parcel`)
                            ))
                        )
                    )
                }
            ]
        });
        return parcel._methods._applyMatchPipes();
    },

    _applyMatchPipes: () => {
        let typedPathString = _this._id.typedPathString();
        return pipeWith(
            _this,
            ..._this._matchPipes
                .filter(({match, depth}: MatchPipe): boolean => {
                    let matched = Matcher(typedPathString, match, depth);
                    return matched;
                })
                .map(({updater}: MatchPipe) => updater)
        );
    },

    // Status methods

    hasDispatched: (): boolean => {
        return _this._treeshare.dispatch.hasPathDispatched(_this.path);
    },

    // Side-effect methods

    log: (name: string): Parcel => {
        _this._log = true;
        _this._logName = name;
        console.log(`Parcel data: ${name} `);
        _this.toConsole();
        return _this;
    },

    spy: (sideEffect: Function): Parcel => {
        Types(`spy()`, `sideEffect`, `function`)(sideEffect);
        sideEffect(_this);
        return _this;
    },

    spyChange: (sideEffect: Function): Parcel => {
        Types(`spyChange()`, `sideEffect`, `function`)(sideEffect);
        return _this._create({
            id: _this._id.pushModifier('sc'),
            onDispatch: (changeRequest: ChangeRequest) => {
                sideEffect(changeRequest._setBaseParcel(_this));
                _this.dispatch(changeRequest);
            }
        });
    },

    // Debug methods

    toConsole: () => {
        console.log(_this.data);
    }
});
