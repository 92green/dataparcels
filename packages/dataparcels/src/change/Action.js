// @flow
import type {ActionStep} from '../types/Types';
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';

import unshift from 'unmutable/lib/unshift';

type ActionData = {
    type?: string,
    payload?: Object,
    keyPath?: Array<Key|Index>,
    steps?: Array<ActionStep>
};

type CreateActionData = {
    type?: string,
    payload?: Object,
    keyPath?: Array<Key|Index>,
    steps?: Array<ActionStep>
};

export default class Action {
    type: string = "";
    payload: Object = {};
    keyPath: Array<Key|Index> = [];
    steps: Array<ActionStep> = [];

    constructor({type, payload, keyPath, steps}: ActionData = {}) {
        this.type = type || this.type;
        this.payload = payload || this.payload;
        this.keyPath = keyPath || this.keyPath;

        if(!steps) {
            steps = keyPath
                ? keyPath.map(key => ({
                    type: 'get',
                    key
                }))
                : this.steps;
        }

        this.steps = steps;
    }

    _create = (create: CreateActionData): Action => {
        return new Action({
            ...this.toJS(),
            ...create
        });
    };

    _addStep = (step: ActionStep): Action => {
        return this._create({
            steps: unshift(step)(this.steps),
            keyPath: step.type === 'get'
                ? unshift(step.key)(this.keyPath)
                : this.keyPath
        });
    };

    toJS = (): ActionData => {
        let {type, payload, keyPath, steps} = this;
        return {type, payload, keyPath, steps};
    };
}
