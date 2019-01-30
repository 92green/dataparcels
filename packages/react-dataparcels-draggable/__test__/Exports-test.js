// @flow

// dataparcels exports
import Draggable from '../src/index';
import InternalDraggable from '../src/Draggable';

test('index should export Draggable', () => {
    expect(Draggable).toBe(InternalDraggable);
});
