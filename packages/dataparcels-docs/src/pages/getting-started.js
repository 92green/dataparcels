// @flow
import type {Node} from 'react';
import React from 'react';
import {Box, Text, Typography} from 'dcme-style';
import GettingStartedMarkdown from 'pages/getting-started.md';

export default () => <Box>
    <Typography>
        <GettingStartedMarkdown />
    </Typography>
</Box>;
