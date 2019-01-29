// @flow
import {stringifyPath} from '../parcelId/ParcelId';

class ParcelRegistry {
    _registry: Object = {};
    get = (id: string): Object => {
        return this._registry[id];
    };

    set = (id: string, reference: Object) => {
        this._registry[id] = reference;
    };
}

class LocationShareRegistry {
    _locationShareData: Object = {};

    get = (path: string[]): * => {
        return this._locationShareData[stringifyPath(path)] || {};
    };

    set = (path: string[], partialData: Object) => {
        this._locationShareData[stringifyPath(path)] = {
            ...this.get(path),
            ...partialData
        };
    };
}

type Config = {
    registry?: ParcelRegistry,
    locationShare?: LocationShareRegistry
};

export default class Treeshare {
    registry: ParcelRegistry;
    locationShare: LocationShareRegistry;

    constructor(config: Config = {}) {
        let {
            registry,
            locationShare
        } = config;

        this.registry = registry || new ParcelRegistry();
        this.locationShare = locationShare || new LocationShareRegistry();
    }

    boundarySplit: Function = (): Treeshare => {
        return new Treeshare({
            // do not pass in registry
            locationShare: this.locationShare
        });
    }
}
