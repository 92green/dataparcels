// @flow
import React from 'react';
import Page from 'component/Page';
import {ContentNav} from 'dcme-style';
import ParcelMarkdown from 'mdx/api/Parcel.mdx';
import {apiNav} from 'nav/apiNav';

export default () => <Page>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={apiNav}
        pageNav={[
            '# Parcel',
            '# Properties',
            'value',
            'meta',
            'data',
            'key',
            'type',
            'parentType',
            'id',
            'path',
            'isParent',
            'isChild',
            'size',
            '# Parent-type methods',
            'has',
            '# Branch methods',
            'get',
            'getIn',
            'children',
            'metaAsParcel',
            '# Input binding methods',
            'spread',
            'spreadInput',
            'spreadCheckbox',
            '# Change methods',
            'set',
            'delete',
            'update',
            'setMeta',
            'dispatch',
            '# Array-type properties',
            'isFirstChild',
            'isLastChild',
            'isOnlyChild',
            '# Array-type change methods',
            'insertAfter',
            'insertBefore',
            'moveTo',
            'push',
            'pop',
            'shift',
            'swapNext',
            'swapPrev',
            'unshift',
            '# Modify methods',
            'modifyDown',
            'modifyUp',
            'initialMeta',
            '# Composition methods',
            'pipe'
        ]}
    >
        <ParcelMarkdown />
    </ContentNav>
</Page>;
