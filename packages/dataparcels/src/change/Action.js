// @flow
import type {ActionStep} from '../types/Types';
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';

type ActionData = {
    type?: string,
    payload?: any,
    keyPath?: Array<Key|Index>,
    steps?: Array<ActionStep>
};

export default class Action {
    type: string = "";
    payload: any;
    keyPath: Array<Key|Index> = [];
    steps: Array<ActionStep> = [];

    constructor({type, payload = this.payload, keyPath, steps}: ActionData = {}) {
        this.type = type || this.type;
        this.payload = payload;
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

    _addStep = (step: ActionStep): Action => {
        return new Action({
            type: this.type,
            payload: this.payload,
            steps: [step, ...this.steps],
            keyPath: step.type === 'get'
                // $FlowFixMe - I'll make sure that step.key is defined when type is 'get'
                ? [step.key, ...this.keyPath]
                : this.keyPath
        });
    };
}
