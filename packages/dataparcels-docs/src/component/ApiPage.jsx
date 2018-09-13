// @flow
import type {Node} from 'react';
import React from 'react';
import {Box, Grid, GridItem, NavigationList, NavigationListItem, Text, Typography} from 'dcme-style';
import Link from 'component/Link';
import SiteNavigation from 'component/SiteNavigation';
import PageLayout from 'component/PageLayout';

const renderApi = (api) => api
    .split('\n')
    .map((line: string): Node => {
        if(line.slice(0,2) === "# ") {
            return line.slice(2);
        }
        if(!line) {
            return <br />;
        }
        return <a className="Link" href={`#${line.replace("()","")}`}>{line.replace("()","")}</a>;
    })
    .map((line, key) => <NavigationListItem key={key}>{line}</NavigationListItem>);

const renderDoclets = ({api, md}) => api
    .split('\n')
    .filter(_ => _)
    .map((name, key) => {
        let simpleName = name.replace("()","");
        if(name.slice(0,2) === "# ") {
            return <Box key={key}>
                <a name={name.slice(2).toLowerCase().replace(/\s+/g, "_")} />
                <Text element="h2" modifier="sizeMega marginMega weightMicro">{name.slice(2)}</Text>
            </Box>;
        }
        let Component = md[simpleName];
        if(!Component) {
            Component = () => <span>...</span>;
        }
        return <Box key={key} modifier="marginBottomGiga">
            <a name={simpleName} />
            <Text element="h3" modifier="sizeKilo marginKilo">{name}</Text>
            <Typography>
                <Component />
            </Typography>
        </Box>;
    })
    .filter(_ => _);

type Props = {
    name: string,
    api: string,
    md: *
};

export default ({name, api, md, after}: Props) => {
    let Description = md._desc;
    let After = md._after;
    return <PageLayout
        content={() => <Box>
            <Box modifier="marginBottomGiga">
                <Typography>
                    <Description />
                </Typography>
            </Box>
            {renderDoclets({api, md})}
            {After && <Typography><After /></Typography>}
        </Box>}
        nav={() => <NavigationList>
            <NavigationListItem>{name}</NavigationListItem>
            {renderApi(api)}
        </NavigationList>}
    />;
};
