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

class DispatchRegistry {
    _dispatchedPaths: Object = {};

    hasPathDispatched = (path: string[]): boolean => {
        return !!this._dispatchedPaths[stringifyPath(path)];
    };

    markPathAsDispatched = (path: string[]) => {
        this._dispatchedPaths[stringifyPath(path)] = true;
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
    dispatch?: DispatchRegistry,
    locationShare?: LocationShareRegistry
};

export default class Treeshare {
    registry: ParcelRegistry;
    dispatch: DispatchRegistry;
    locationShare: LocationShareRegistry;

    constructor(config: Config = {}) {
        let {
            registry,
            dispatch,
            locationShare
        } = config;

        this.registry = registry || new ParcelRegistry();
        this.dispatch = dispatch || new DispatchRegistry();
        this.locationShare = locationShare || new LocationShareRegistry();
    }

    boundarySplit: Function = (): Treeshare => {
        return new Treeshare({
            // do not pass in registry
            dispatch: this.dispatch,
            locationShare: this.locationShare
        });
    }
}
