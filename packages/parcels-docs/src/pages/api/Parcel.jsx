// @flow
import type {Node} from 'react';
import React from 'react';
import {Box, Typography} from 'dcme-style';
import ParcelMarkdown from '../../docs/api/parcel/Parcel.md';

export default () => <Box>
    <Typography>
        <ParcelMarkdown />
    </Typography>
</Box>;
