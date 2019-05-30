// @flow
import type {Node} from 'react';
import React from 'react';
import {Box, Grid, GridItem, Text, Typography} from 'dcme-style';
import Link from 'component/Link';
import ContentNav from 'shape/ContentNav';

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
    return <ContentNav
        content={() => <>
            <Description />
            {renderDoclets({api, md})}
            {After && <After />}
        </>}
        pageNav={[
            '# validation',
            ...api.split('\n')
        ]}
    />;
};
