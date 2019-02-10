// @flow

class ParcelRegistry {
    _registry: Object = {};
    get = (id: string): Object => {
        return this._registry[id];
    };

    set = (id: string, reference: Object) => {
        this._registry[id] = reference;
    };
}

type Config = {
    registry?: ParcelRegistry
};

export default class Treeshare {
    registry: ParcelRegistry;

    constructor(config: Config = {}) {
        this.registry = config.registry || new ParcelRegistry();
    }

    boundarySplit: Function = (): Treeshare => {
        return new Treeshare({});
    }
}
