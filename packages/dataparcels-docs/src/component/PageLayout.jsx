// @flow
import type {Node} from "react";
import React from "react";
import {Box, Grid, GridItem, NavigationList, NavigationListItem, Wrapper} from 'dcme-style';
import SiteNavigation from 'component/SiteNavigation';

type Props = {
    content: () => Node,
    nav?: () => Node
};

export default ({content, nav}: Props) => <Wrapper modifier="marginBottom">
    <Grid>
        <GridItem modifier="9 padding">
            {content()}
        </GridItem>
        <GridItem modifier="3 padding">
            <SiteNavigation />
            {nav && nav()}
        </GridItem>
    </Grid>
</Wrapper>;
