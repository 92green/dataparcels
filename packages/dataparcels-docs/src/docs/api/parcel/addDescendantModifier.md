```flow
type ModifierFunction = Function;
type ModifierObject = {
    match?: string,
    modifier: ModifierFunction
};

addDescendantModifier(modifier: ModifierFunction|ModifierObject): void
```
