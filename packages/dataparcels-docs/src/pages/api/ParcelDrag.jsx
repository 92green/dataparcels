// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import DragMarkdown from 'mdx/api/ParcelDrag.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# ParcelDrag',
            '# Children',
            'childRenderer',
            '# Props',
            'parcel',
            'container',
            '...sortableElementProps'
        ]}
    >
        <DragMarkdown />
    </ContentNav>
</Page>;
