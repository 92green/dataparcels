// @flow
import type {Node} from 'react';
import React from 'react';
import {Box, CenteredLanding, Grid, GridItem, Text, Typography, Wrapper} from 'dcme-style';
import IndexMarkdown from 'pages/index.md';
import PageLayout from 'component/PageLayout';

export default () => <Box>
    <Box modifier="invertedCopy invertedBackground">
        <Wrapper>
            <Grid>
                <GridItem modifier="8">
                    <CenteredLanding
                        modifier="heightHalf"
                        top={() => <Text element="h1" modifier="sizeTera superDuper">dataparcels</Text>}
                        bottom={() => <Box>
                            <Text element="p" modifier="monospace margin">A library for editing data structures that works really well with React.</Text>
                            <Text element="p" modifier="monospace"><a className="Link" href="https://github.com/blueflag/dataparcels">github</a> | <a className="Link" href="https://www.npmjs.com/package/dataparcels">npm</a></Text>
                        </Box>}
                    />
                </GridItem>
                <GridItem modifier="4" />
            </Grid>
        </Wrapper>
    </Box>
    <Box modifier="paddingTopKilo">
        <Wrapper modifier="marginBottom">
            <Typography><IndexMarkdown /></Typography>
        </Wrapper>
    </Box>
</Box>
