import Link from 'component/Link';
import {Box, Link as HtmlLink, Message} from 'dcme-style';

### Please be careful


This method is safe to use without `shape()` in most cases, but in some cases it should not be used:

- If the updater gives you a primitive value or childless value, you can return anything.
- If the updater gives you a value that has children, you can always return a primitive value or childless value.
- If the updater gives you a value that has children, you can return a value with children **only if the shape hasn't changed**.

Please ensure you do not change the shape of the value, as changing the data shape or moving children within the data shape can cause dataparcels to misplace its keying and meta information!
Dataparcels stores data against each part of a deep value's data structure, so it can only let you change the value if you promise not to alter the shape.

```js
// example updaters
string => string + "!" // good
string => [string] // good
date => date.toString() // good
array => array.join(".") // good
array => array.map(number => number + 1) // good, shape is still the same

array => array.slice(0,2) // bad, shape has changed if array is longer that 2!
array => array.reverse() // bad, shape has changed because items have moved around!
```

If you need to update the shape of the data, you can do so using `dataparcels/shape`.
The `shape` function will wrap your Parcel's data in a <Link to="/api/ParcelShape">ParcelShape</Link> which allows for safe shape editing. See <Link to="/api/ParcelShape">ParcelShape</Link> for more details.

```js
import shape from 'dataparcels/shape';

let parcel = new Parcel({
    value: [1,2,3]
});

let modifiedParcel = parcel.modifyDown(shape(parcelShape => parcelShape
    .push("foo")
    .push("bar")
    .setMeta({
        cool: true
    })
));
```
