```flow
// updates value - only to be used if shape doesn't change
updateIn(keyPath: Array<string|number>, updater: ParcelValueUpdater): ParcelShape // only on ParentParcels
type ParcelValueUpdater = (value: any) => any;

// updates shape, including meta
updateIn(keyPath: Array<string|number>, shape(shapeUpdater: ParcelShapeUpdater)): ParcelShape // only on ParentParcels
type ParcelShapeUpdater = (parcelShape: ParcelShape) => any;
```
