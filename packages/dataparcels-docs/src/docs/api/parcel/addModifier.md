```flow
type ModifierFunction = Function;
type ModifierObject = {
    match?: string,
    modifier: ModifierFunction
};

addModifier(modifier: ModifierFunction|ModifierObject): void
```
