// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import ParcelKeysMarkdown from 'mdx/concepts/parcel-keys.mdx';
import {conceptsNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={conceptsNav}
        pageNav={[
            '# Parcel Keys',
            'Keyed parents',
            'Indexed parents'
        ]}
    >
        <ParcelKeysMarkdown />
    </ContentNav>
</Page>;
