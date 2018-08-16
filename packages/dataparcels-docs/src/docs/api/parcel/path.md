import Link from 'component/Link';

```flow
path: string[]
```

Returns the Parcel's `path`, an array of strings indicating how to access the current Parcel's value.

```js
let value = {
    abc: {
        def: 123
    }
};
let parcel = new Parcel({value});
parcel.get("abc").get("def").path; // returns ["abc", "def"]
```
