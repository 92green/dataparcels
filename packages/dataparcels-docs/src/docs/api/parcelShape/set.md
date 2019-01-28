import {Box, Link, Message} from 'dcme-style';
import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
set(value: any): ParcelShape
set(key: string|number, value: any): ParcelShape // only on ParentParcels, will set a child
```

Calling `set()` with one argument will return a new ParcelShape where the original value is replaced with the `value` provided.

```js
let parcelShape = new ParcelShape(123);
parcelShape.set(456);
// returns a new ParcelShape containing 456
```

On ParentParcels this method can also be called with a `key`, which returns a new ParcelShape with the the child value at that `key` set to `value`.

```js
let parcelShape = new ParcelShape({
    value: {
        abc: 123,
        def: 789
    }
});
parcelShape.set('abc', 456);
// returns a new ParcelShape containing {abc: 456, def: 789}
```

<IndexedKeys />
