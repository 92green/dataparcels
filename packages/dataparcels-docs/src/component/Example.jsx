// @flow
import React from 'react';
import {Fragment} from 'react';
import {Box, NavigationList, Text, Typography} from 'dcme-style';
import PageLayout from 'component/PageLayout';
import APINavigation from 'component/APINavigation';

type Props = {
    name: string,
    md: *
};

export default ({name, md: Markdown, ...rest}: Props) => <PageLayout
    modifier="marginBottom"
    content={() => <Typography>
        <Text element="h1">{name}</Text>
        <Markdown {...rest} />
    </Typography>}
    nav={() => <Fragment>
        <APINavigation />
        <NavigationList>
        </NavigationList>
    </Fragment>}
/>;
