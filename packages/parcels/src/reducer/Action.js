// @flow

type ActionData = {
    type: string,
    payload?: Object,
    keyPath?: string[]
};

export default class Action {
    type: string;
    payload: ?Object;
    keyPath: string[];

    constructor(actionData: ActionData) {
        this.type = actionData.type;
        this.payload = actionData.payload || {};
        this.keyPath = actionData.keyPath || [];
    }

    toJS(): Object {
        let {type, payload, keyPath} = this;
        return {type, payload, keyPath};
    }
}
