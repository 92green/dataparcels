import Link from 'component/Link';
import Param from 'component/Param';
import ParcelHocExample from 'pages/examples/parcelhoc-example.md';
import ParcelHocInitialValueFromProps from 'pages/examples/parcelhoc-initialvalue.md';
import ParcelHocOnChange from 'pages/examples/parcelhoc-onchange.md';

# ParcelHoc

ParcelHoc is a higher order component that creates a Parcel on mount, stores it in its own state, and passes the Parcel down as props. It abstracts away most of the binding between a Parcel and the lifecycle methods of a React component.

It is recommended that you <Link to="/examples/editing-objects">use ParcelHoc</Link>, rather than <Link to="/examples/managing-your-own-parcel-state">managing your own Parcel state</Link>.

```js
import {ParcelHoc} from 'react-dataparcels';
```

```flow
ParcelHoc({
    name: string,
    initialValue?: Function,
    delayUntil?: Function,
    onChange?: Function,
    pipe?: Function
    // debugging options
    debugRender?: boolean
});
```

* <Param name="name" type="string" />
  Sets the name of the prop that will contain the parcel.
* <Param name="initialValue" optional type="(props: Object) => any" />
  The `initialValue` function will be called once when ParcelHoc mounts. It is passed `props`, and the returned value is used as the initial value of the ParcelHoc's Parcel.
* <Param name="delayUntil" optional type="(props: Object) => boolean" />
  You can delay the creation of the parcel by providing an `delayUntil` function. It will be called on mount and at every prop change until the parcel is created. It is passed `props`, and the Parcel will not be created until `true` is returned. A value of `undefined` will be passed down until the Parcel is created. Once the returned value is `true`, the Parcel will be created with the props at that time.
* <Param name="onChange" optional type="(props: Object) => (parcel: Parcel, changeRequest: ChangeRequest) => void" />
  The `onChange` function is called whenever ParcelHoc changes. It expects to be given a double barrel function. The first function will be passed `props`, and the next is passed the recently-changed Parcel.

  `onChange` is often used to relay changes further up the React DOM heirarchy. This works in a very similar way to [uncontrolled components in React](https://reactjs.org/docs/uncontrolled-components.html).
* <Param name="pipe" optional type="(props: Object) => (parcel: Parcel) => Parcel" />
  This function gives you the opportunity to modify the parcel before it reaches any other components.

  The `pipe` function expects to be given a double barrel function. The first function will be passed `props`, and the next is passed the Parcel. The result of the `pipe` function will then be passed down as props.
* <Param name="debugRender" optional type="boolean" default="false" />
  For debugging purposes. When set to `true` this causes all downstream <Link to="/api/ParcelBoundary">ParcelBoundary</Link>s to display when they are being rendered and re-rendered.


## Example

<ParcelHocExample />

## More examples

* <Link to="/examples/parcelhoc-initialvalue">ParcelHoc - Getting initialValue from props</Link>
* <Link to="/examples/parcelhoc-onchange">ParcelHoc - Using onChange</Link>
* <Link to="/examples/parcelhoc-delayuntil">ParcelHoc - Using delayUntil</Link>


