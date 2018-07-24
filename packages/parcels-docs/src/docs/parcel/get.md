<Function name="get">
get(key: string|number): Parcel
get(key: string|number, notSetValue: *): Parcel
</Function>

Returns a Parcel containing the value associated with the provided key / index.
If the key / index doesn't exist, a Parcel with a value of `notSetValue` will be returned. If `notSetValue` is not provided then a Parcel with a value of 
 `undefined` will be returned.
 
```js
let value = {
    abc: 123,
    def: 456
};
let parcel = new Parcel({value});
parcel.get('abc').value(); // returns 123
parcel.get('xyz').value(); // returns undefined
parcel.get('xyz', 789).value(); // returns 789
```
