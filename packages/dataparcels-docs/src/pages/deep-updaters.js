// @flow
import React from 'react';
import {Box, CenteredLanding, Text} from 'dcme-style';

export default () => <Box>
    <CenteredLanding
        top={() => <Text element="h1" modifier="sizeTera center">Deep Updaters</Text>}
        bottom={() => <Text element="p" modifier="monospace center margin">This doesn't exist yet. These docs are still very much under construction.</Text>}
    />
</Box>;
