// @flow
class TreeshareRegistry {
	_registry: Object = {};

    get = (id: string): Object => {
        return this._registry[id];
    };

    set = (id: string, reference: Object) => {
        this._registry[id] = reference;
    };
}

export default class Treeshare {
    registry: Object = new TreeshareRegistry();
}