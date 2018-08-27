import Link from 'component/Link';
import Param from 'component/Param';
import ParcelStateHocExample from 'pages/examples/parcelstatehoc-example.md';
import ParcelStateHocInitialValueFromProps from 'pages/examples/parcelstatehoc-initial-value-from-props.md';
import ParcelStateHocHandleChange from 'pages/examples/parcelstatehoc-handle-change.md';

# ParcelStateHoc

ParcelStateHoc is a higher order component that stores a Parcel in React state, passing the Parcel down as props. It abstracts away most of the binding between a Parcel and the lifecycle methods of a React component.

It is recommended that you <Link to="/examples/editing-objects">use ParcelStateHoc</Link>, rather than <Link to="/examples/managing-your-own-parcel-state">managing your own Parcel state</Link>.

```js
import {ParcelStateHoc} from 'react-dataparcels';
```

```flow
ParcelStateHoc({
    prop: string,
    initialValue?: Function,
    handleChange?: Function,
    pipe?: Function
    // debugging options
    debugRender?: boolean
});
```

* <Param name="prop" type="string" />
  Sets the name of the Parcel prop.
* <Param name="initialValue" optional type="(props: Object) => any" />
  The `initialValue` function will be called once when ParcelStateHoc mounts. It is passed `props`, and the returned value is used as the initial value of the ParcelStateHoc's Parcel.
* <Param name="handleChange" optional type="(props: Object) => (parcel: Parcel, changeRequest: ChangeRequest) => void" />
  The `handleChange` function is called whenever ParcelStateHoc changes. It expects to be given a double barrel function. The first function will be passed `props`, and the next is passed the recently-changed Parcel.

  `handleChange` is often used to relay changes further up the React DOM heirarchy. This is similar to an uncontrolled input in React.
* <Param name="pipe" optional type="(props: Object) => (parcel: Parcel) => Parcel" />
  This function gives you the opportunity to modify the parcel before it reaches any other components.

  The `pipe` function expects to be given a double barrel function. The first function will be passed `props`, and the next is passed the Parcel. The result of the `pipe` function will then be passed down as props.
* <Param name="debugRender" optional type="boolean" default="false" />
  For debugging purposes. When set to `true` this causes all downstream <Link to="/api/PureParcel">PureParcel</Link>s to display when they are being rendered and re-rendered.


## 1. Basic example

<ParcelStateHocExample />

## 2. initialValue from props

<ParcelStateHocInitialValueFromProps />

## 3. handleChange example

<ParcelStateHocHandleChange />
