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
            '# Branch methods',
            'get()',
            'getIn()',
            'children()',
            'toArray()',
            'metaAsParcel()',
            '# Input binding methods',
            'spread()',
            'spreadDOM()',
            'spreadDOMCheckbox()',
            'onChange()',
            'onChangeDOM()',
            'onChangeDOMCheckbox()',
            '# Child methods',
            'isFirst()',
            'isLast()',
            '# Change methods',
            'set()',
            'delete()',
            'update()',
            'map()',
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
            'size()',
            '# Type methods',
            'isChild()',
            'isElement()',
            'isIndexed()',
            'isParent()',
            'isTopLevel()',
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
