import ParcelMeta from 'docs/notes/ParcelMeta.md';
import Link from 'component/Link';

```flow
setMeta(partialMeta: Object): void
```

Triggers a change that sets `meta` at the current parcel's location. Values on the `partialMeta` object are merged shallowly onto any existing `meta`.

<ParcelMeta />

```js
let parcel = new Parcel({
    value: "abc"
});

parcel.setMeta({
    abc: 123
});
// ^ this triggers a change that sets the parcel's meta to {abc: 123}

parcel.setMeta({
    def: 456
});
// ^ this triggers a change that sets the parcel's meta to {abc: 123, def: 456}
```
