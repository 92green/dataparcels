```flow
// updates value - only to be used if shape doesn't change
map(updater: ParcelValueUpdater): ParcelShape // only on ParentParcels
type ParcelValueUpdater = (value: any) => any;

// updates shape, including meta
map(shape(shapeUpdater: ParcelShapeUpdater)): ParcelShape // only on ParentParcels
type ParcelShapeUpdater = (parcelShape: ParcelShape) => any;
```
