// @flow
import type {Node} from 'react';
import React from 'react';
import {Box, Text, Typography} from 'dcme-style';
import IndexMarkdown from './index.md';

export default () => <Box>
    <Typography>
        <IndexMarkdown />
    </Typography>
</Box>;
