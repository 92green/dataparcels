// @flow
import React from 'react';
import Layout from 'layout/Layout';
import ContentNav from 'shape/ContentNav';
import ParcelMarkdown from 'pages/api/Parcel.mdx';

export default () => <Layout>
    <ContentNav
        content={() => <ParcelMarkdown />}
        pageNav={[
            '# Parcel',
            '# Properties',
            'value',
            'meta',
            'data',
            'key',
            'id',
            'path',
            'isParent',
            'isChild',
            'isIndexed',
            'isElement',
            'size',
            'isFirst',
            'isLast',
            'isOnly',
            '# Branch methods',
            'get()',
            'getIn()',
            'children()',
            'toArray()',
            'metaAsParcel()',
            '# Input binding methods',
            'spread()',
            'spreadInput()',
            'spreadCheckbox()',
            '# Child methods',
            '# Change methods',
            'set()',
            'delete()',
            'update()',
            'setMeta()',
            'dispatch()',
            '# Indexed and element change methods',
            'insertAfter()',
            'insertBefore()',
            'push()',
            'pop()',
            'shift()',
            'swap()',
            'swapNext()',
            'swapPrev()',
            'unshift()',
            '# Parent methods',
            'has()',
            '# Modify methods',
            'modifyDown()',
            'modifyUp()',
            'initialMeta()',
            '# Side-effect methods',
            'spy()',
            'spyChange()',
            '# Composition methods',
            'pipe()'
        ]}
    />
</Layout>;
