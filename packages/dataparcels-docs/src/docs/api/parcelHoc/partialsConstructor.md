import {Box, Message} from 'dcme-style';
import Link from 'component/Link';

```flow
partialsConstructor?: (value: Object) => any // optional
```

When using `config.partials`, you can also use `partialsConstructor` to change the data type that gets stored in the ParcelHoc. It gives a plain object, and the returned value of `partialsConstructor` is put in the ParcelHoc. 
