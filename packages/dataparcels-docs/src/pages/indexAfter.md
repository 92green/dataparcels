import Link from 'gatsby-link';
import API from 'content/API';
import {Divider} from 'dcme-style';

<Divider />

## Development

Dataparcels is written and maintained by <a href="https://damienclarke.me/">Damien Clarke</a>, with feedback from <a href="https://github.com/allanhortle">Allan Hortle</a> and others at <a href="https://blueflag.com.au/about-us/">Blueflag</a>.
All online library discussion happens over on <a href="https://github.com/blueflag/dataparcels">Github</a>.

As this library matures I intend to make it easier for other to help out, such as guidelines for contributing, design rules and philosophies this library uses, developement setup, and details on dataparcels internal architecture.

I hope this library helps solve some front-end problems for you.

### Roadmap

- Additions for binding Parcels to HTML checkboxes.
- **Hooks**. Prototype `useParcelState` and `useParcelBuffer` hooks. The release of dataparcels hooks will cause the deprecation of `ParcelHoc` and `ParcelBoundaryHoc`.
- Document data synchronisation strategies with examples.
- Async `useParcelState.onChange`, and ability for failed `onChange` calls to reinstate unsaved changes in a lower Parcel buffer. This is a crucial feature that will allow for forms to rollback when requests fail.
- Add merge mode to control how downward changes are accepted into `ParcelBoundary` components. This is required for rekey.
- Add rekey, which enables changes via props to be merged into buffered changes (i.e. unsaved changes). This will allow multiple editors to alter the same piece of data simultaneously without overwriting. The ability to rebase unsaved changes onto updated data already exists, but rekey is required to make sense of incoming changes via props.
- Add a hook into `useParcelBuffer` to save, reload and clear cached data. This can be used with `localStorage` or similar external storage mechanisms to retain and restore unsaved changes.
- Add a proper build process with dev and prod builds, that doesn't rely on minification and dead code elimination being carried out by the containing project's build process. This step will finally allow proper optimisations to reduce bundle size.
