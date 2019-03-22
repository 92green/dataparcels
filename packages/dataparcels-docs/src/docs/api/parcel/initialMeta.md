import ParcelMeta from 'docs/notes/ParcelMeta.md';

```flow
initialMeta(initialMeta: Object): Parcel
```

Parcel `meta` defaults to an empty object. The `initialMeta` method replaces the meta for all descendant Parcels.

Once a descendant Parcel triggers a change, the initial meta is also propagated up to the top level Parcel.

```js
let parcel = new Parcel({
    value: "abc"
});

parcel
    .initialMeta({
        abc: 123
    })
    .meta // this returns {abc: 123} initially, but this can change after subsequent calls to setMeta()

```

<ParcelMeta />
