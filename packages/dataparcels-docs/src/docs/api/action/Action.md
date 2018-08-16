# Action

```js
import {Action} from 'dataparcels';
import {Action} from 'react-dataparcels';
```

```flow
new Action({
   type: ?string,
   payload: ?*,
   keyPath: ?string[]
});
```

When a change occurs, Actions are used internally by `dataparcels` to describe what to change and how to change it.
