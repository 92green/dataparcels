import Link from 'component/Link';

# Parcel

```flow
new Parcel({
    value?: any,
    handleChange?: Function,
    // debugging options
    debugRender?: boolean
});
```

Creates a new Parcel. Please see the <Link to="/getting-started">getting started</Link> page to see how to best use Parcels in a React app.

* `value`
* `handleChange`


```js
// creates a Parcel that contains a value of 123
let parcel = new Parcel({
    value: 123,
    handleChange: (newParcel) => {
        // here you can insert logic to replace
        // your existing parcel with the newParcel
    })
});
```
