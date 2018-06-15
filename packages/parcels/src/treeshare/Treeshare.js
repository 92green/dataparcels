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

export default class Treeshare {
    _debugRender: boolean = false;
    registry: ParcelRegistry = new ParcelRegistry();
    dispatch: DispatchRegistry = new DispatchRegistry();
    locationShare: LocationShareRegistry = new LocationShareRegistry();

    constructor({debugRender}: Object) {
        this._debugRender = debugRender;
    }

    getDebugRender: Function = (): boolean => {
        return this._debugRender;
    }
}
