import Link from 'component/Link';

# Action

```js
import Action from 'dataparcels/Action';
import Action from 'react-dataparcels/Action';
```

```flow
new Action({
   type: ?string,
   payload: ?*,
   keyPath: ?string[]
});
```

When a change occurs, Actions are used internally by `dataparcels` to describe each change to make. Actions are found within  <Link to="/api/ChangeRequest">ChangeRequests</Link>.

Most of the time these operate invisibly, and it's extremely rare that you'll create these yourself.
