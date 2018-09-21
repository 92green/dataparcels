```flow
forceUpdate?: Array<*>
```

While a ParcelBoundary is using pure rendering, `forceUpdate` will force the ParcelBoundary to re-render in response to changes in other props. Each item in the `forceUpdate` array is compared using strict equality against its previous values, and if any are not strictly equal, the ParcelBoundary will re-render.
