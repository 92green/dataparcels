import Link from 'component/Link';
import ShapeUpdater from 'docs/notes/ShapeUpdater.md';
import {Box, Link as HtmlLink, Message} from 'dcme-style';

```flow
modifyShapeUp(updater: ShapeUpdater): Parcel

type ShapeUpdater = (parcelShape: ParcelShape) => any
```

The `modifyShapeUp()` method is an advanced version of <HtmlLink href="#modifyUp">modifyUp()</HtmlLink>. It provides a <Link to="/api/ParcelShape">ParcelShape</Link> containing the value to update. It expects either a ParcelShape or a value to be returned. If a value is returned, and if the returned value has children, then those children *must* all be ParcelShapes.

Additionally if `updater` returns nothing (undefined), the change will be cancelled and will not propagate up any further.
If you want to legitimately return a value of `undefined` and continue to propagate the change request, return `new ParcelShape()` instead.

<ShapeUpdater alt="modifyUp" />
