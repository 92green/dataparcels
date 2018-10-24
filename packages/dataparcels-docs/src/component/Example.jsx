// @flow
import React from 'react';
import {Box, NavigationList, Text, Typography} from 'dcme-style';
import PageLayout from 'component/PageLayout';

type Props = {
    name: string,
    md: *
};

export default ({name, md: Markdown}: Props) => <PageLayout
    content={() => <Typography>
        <Text element="h1">{name}</Text>
        <Markdown />
    </Typography>}
    nav={() => <NavigationList></NavigationList>}
/>;
