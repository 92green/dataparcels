// @flow
import type {Node} from 'react';
import React from 'react';
import {Typography} from 'dcme-style';
import IndexMarkdown from 'babel-loader!mdx-loader!./index.md';

export default ({data}: *) => <Typography>
    <IndexMarkdown data={data} />
</Typography>;
