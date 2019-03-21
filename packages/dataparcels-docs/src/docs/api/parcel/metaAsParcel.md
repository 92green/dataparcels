import ParcelMeta from 'docs/notes/ParcelMeta.md';

```flow
metaAsParcel(key: string): Parcel
```

Typically Parcel meta is accessed and set via the `.meta` property and the `.setMeta()` method. The `metaAsParcel()` function is an alternative that creates a Parcel that controls a piece of meta data. It's useful for binding meta changes to inputs.

```js
let parcel = new Parcel({value: 123});

<input {...parcel.metaAsValue('foo').spreadDOM()} />

// if 'bar' is entered in the input, parcel.meta.foo will equal 'bar'
```

<ParcelMeta />
