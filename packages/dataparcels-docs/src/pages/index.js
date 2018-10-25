// @flow
import type {Node} from 'react';

import React from 'react';
import {Box, CenteredLanding, Grid, GridItem, Image, Link as HtmlLink, NavigationList,NavigationListItem, Text, Typography, Wrapper} from 'dcme-style';
import IndexMarkdown from 'pages/index.md';
import PageLayout from 'component/PageLayout';
import API from 'content/API';
import IconParcel from 'content/parcelinverted.gif';
import APIExamples from 'content/APIExamples.md';

export default () => <Box>
    <Box modifier="invertedCopy invertedBackground">
        <Wrapper>
            <CenteredLanding
                modifier="heightHalf"
                top={() => <Text element="h1" modifier="sizeTera superDuper">dataparcels</Text>}
                bottom={() => <Grid>
                    <GridItem modifier="8 padding">
                        <Text element="p" modifier="monospace margin">A library for editing data structures that works really well with React.</Text>
                        <Text element="p" modifier="monospace"><HtmlLink href="https://github.com/blueflag/dataparcels">github</HtmlLink> | <HtmlLink href="https://www.npmjs.com/package/react-dataparcels">npm</HtmlLink> | <HtmlLink href="#API">api</HtmlLink></Text>
                    </GridItem>
                    <GridItem modifier="4 padding">
                        <Image modifier="center logo" src={IconParcel} />
                    </GridItem>
                </Grid>}
            />
        </Wrapper>
    </Box>
    <Box modifier="paddingTopKilo">
        <Wrapper modifier="marginBottom">
            <PageLayout
                content={() => <Box>
                    <Typography>
                        <IndexMarkdown />
                    </Typography>
                </Box>}
                nav={() => <NavigationList>
                    <NavigationListItem><HtmlLink href={`#What-is-it`}>What is it?</HtmlLink></NavigationListItem>
                    <NavigationListItem><HtmlLink href={`#Getting-Started`}>Getting Started</HtmlLink></NavigationListItem>
                    <NavigationListItem><HtmlLink href={`#Examples`}>Examples</HtmlLink></NavigationListItem>
                    <NavigationListItem><HtmlLink href={`#API`}>API</HtmlLink></NavigationListItem>
                    <NavigationListItem><HtmlLink href={`#API-Examples`}>API Examples</HtmlLink></NavigationListItem>
                </NavigationList>}
            />
            <Wrapper>
                <Text id="API" element="h2" modifier="sizeMega">API</Text>
                <API />
                <Text id="API-Examples" element="h2" modifier="sizeMega">API Examples</Text>
                <Typography>
                    <APIExamples />
                </Typography>
            </Wrapper>
        </Wrapper>
    </Box>
</Box>
