import {Box, Message} from 'dcme-style';
import Link from 'component/Link';

```flow
segmentsConstructor?: (value: Object) => any // optional
```

When using `config.segments`, you can also use `segmentsConstructor` to change the data type that gets stored in the ParcelHoc. It gives a plain object, and the returned value of `segmentsConstructor` is put in the ParcelHoc. 
