```flow
shouldBeSynchronous(): boolean
```

Some types of actions (such as `ping`) are "synchronous", meaning that they will ignore debouncing and buffering, propagating immediately to the top level parcel when included in a ChangeRequest. This method returns true if the action is synchronous.
