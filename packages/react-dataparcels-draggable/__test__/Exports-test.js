// @flow

// dataparcels exports
import Drag from '../src/index';
import InternalDrag from '../src/Drag';

test('index should export Drag', () => {
    expect(Drag).toBe(InternalDrag);
});
