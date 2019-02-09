// @flow
import type {Node} from 'react';

import React from 'react';
import {Box, CenteredLanding, Grid, GridItem, Image, Link as HtmlLink, NavigationList,NavigationListItem, Text, Typography, Wrapper} from 'dcme-style';
import IndexMarkdown from 'pages/index.md';
import IndexAfterMarkdown from 'pages/indexAfter.md';
import PageLayout from 'component/PageLayout';
import API from 'content/API';
import IconParcel from 'content/parcelinverted.gif';
import APINavigation from 'component/APINavigation';

export default () => <Box>
    <Box modifier="invertedCopy invertedBackground">
        <Wrapper>
            <CenteredLanding
                modifier="heightHalf"
                top={() => <Text element="h1" modifier="sizeTera superDuper">dataparcels</Text>}
                bottom={() => <Grid>
                    <GridItem modifier="8 padding">
                        <Text element="p" modifier="monospace margin">A library for editing data structures that works really well with React.</Text>
                        <Text element="p" modifier="monospace"><HtmlLink href="https://github.com/blueflag/dataparcels">github</HtmlLink> | <HtmlLink href="https://www.npmjs.com/package/react-dataparcels">npm</HtmlLink> | <HtmlLink href="#API">api documentation</HtmlLink></Text>
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
                nav={() => <Box>
                    <NavigationList>
                        <NavigationListItem><HtmlLink href={`#What-is-it`}>What is it?</HtmlLink></NavigationListItem>
                        <NavigationListItem><HtmlLink href={`#Getting-Started`}>Getting Started</HtmlLink></NavigationListItem>
                    </NavigationList>
                    <NavigationList>
                        <NavigationListItem><HtmlLink href={`#Features`}>Features</HtmlLink></NavigationListItem>
                        <NavigationListItem>- <HtmlLink href={`#1.-Data-editing`}>Data editing</HtmlLink></NavigationListItem>
                        <NavigationListItem>- <HtmlLink href={`#2.-UI-behaviour`}>UI behaviour</HtmlLink></NavigationListItem>
                        <NavigationListItem>- <HtmlLink href={`#3.-Data-synchronisation`}>Data synchronisation</HtmlLink></NavigationListItem>
                    </NavigationList>
                    <APINavigation />
                    <NavigationList>
                        <NavigationListItem><HtmlLink href={`#Development`}>Development</HtmlLink></NavigationListItem>
                    </NavigationList>
                </Box>}
            />
            <Wrapper>
                <Text id="API" element="h2" modifier="sizeMega">API</Text>
                <API />
                <Grid>
                    <GridItem modifier="9 padding">
                        <Typography>
                            <IndexAfterMarkdown />
                        </Typography>
                    </GridItem>
                    <GridItem />
                </Grid>
            </Wrapper>
        </Wrapper>
    </Box>
</Box>
