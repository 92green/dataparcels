// @flow
import React from 'react';
import Page from 'component/Page';
import {H1} from 'dcme-style';

import {Box} from 'dcme-style/layout';
import {Flex} from 'dcme-style/layout';
import {TextWrapper} from 'dcme-style/layout';
import {styled} from 'dcme-style/core';

import {Icon} from 'dcme-style/affordance';
import {Link} from 'dcme-style/affordance';
import {Text} from 'dcme-style/affordance';
import {ContentNav} from 'dcme-style';

import {nav} from 'nav/apiNav';
import Description from 'mdx/description.mdx';

const SuperDuper = styled(H1)`
    color: #000;
    line-height: 3rem;
    text-shadow: -2px 2px 0px #9ab5e4, -3px 3px 0px #e9eff9;
    font-size: 2.8rem;

    @media (min-width: ${props => props.theme.breakpoints[1]}) {
        text-shadow: -3px 3px 0px #9ab5e4, -6px 6px 0px #e9eff9;
        line-height: 4rem;
        font-size: 3.2rem;
    }

    @media (min-width: ${props => props.theme.breakpoints[2]}) {
        font-size: 4rem;
    }
`;

const HeaderWrapper = styled.nav`
    @media (min-width: ${props => props.theme.breakpoints[2]}) {
        padding-left: ${props => props.theme.widths.nav};
    }
`;

export default () => <Page>
    <HeaderWrapper>
        <Box px={3} pt={5} pb={4}>
            <Text as="div" textStyle="monospace">
                <Flex alignItems="flex-end" flexWrap="wrap">
                    <Box mr={3}>
                        <SuperDuper>dataparcels</SuperDuper>
                    </Box>
                    <Flex alignItems="flex-end" pt={2}>
                        <Box mr={3}>
                            <Link href="https://www.npmjs.com/package/react-dataparcels"><Icon icon="npm" /> npm</Link>
                        </Box>
                        <Box>
                            <Link href="https://github.com/92green/dataparcels"><Icon icon="github" /> github</Link>
                        </Box>
                    </Flex>
                </Flex>
            </Text>
        </Box>
    </HeaderWrapper>
    <ContentNav
        pageTop
        pageBottom
        mdxHeading
        nav={nav}
        pageNav={[
            '# Dataparcels',
            'Installation',
            'API documentation',
            'Concepts',
            'Development'
        ]}
    >
        <TextWrapper>
            <Description />
        </TextWrapper>
    </ContentNav>
</Page>;
