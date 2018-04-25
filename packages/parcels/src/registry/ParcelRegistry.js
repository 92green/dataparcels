// @flow
export default class ParcelRegistry {
    _registry = {};

    get = (id: string): Object => {
        return this._registry[id];
    };

    set = (id: string, reference: Object) => {
        this._registry[id] = reference;
    };
}
