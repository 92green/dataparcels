### Please be careful

This method is safe to use in most simple cases, but in some cases it should not be used:

- If the updater gives you a primitive value or childless value, you can return anything.
- If the updater gives you a value that has children, you can always return a primitive value or childless value.
- If the updater gives you a value that has children, you can return a value with children **only if the shape hasn't changed**.

To find out why, and what to do about it, please read about [parcel updaters](/concepts/parcel-updaters).
