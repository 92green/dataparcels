```flow
// updates value - only to be used if shape doesn't change
update(updater: ParcelValueUpdater): ParcelShape
update(key: string|number, updater: ParcelValueUpdater): ParcelShape // only on ParentParcels, will update a child
type ParcelValueUpdater = (value: any) => any;

// updates shape, including meta
update(shape(shapeUpdater: ParcelShapeUpdater)): ParcelShape
update(key: string|number, shape(updater: ParcelValueUpdater)): ParcelShape // only on ParentParcels, will update a child
type ParcelShapeUpdater = (parcelShape: ParcelShape) => any;
```
