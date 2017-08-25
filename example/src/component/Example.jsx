import React from 'react';
import {Box, Column, Grid, Terminal, Text} from 'obtuse';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';

export default (props) => {
    const {
        children,
        description,
        source,
        state,
        title
    } = props;

    const cleanedSource = source && source
        .replace(/{?\/\*nosrc\*\/}?([\s\S]*?){?\/\*endnosrc\*\/}?\n?/gi, '')
        .replace(/ className=".*?"/gi, '');

    return <Box modifier="marginRowGiga">
        <Text element="h2" modifier="sizeMega marginMega">{title}</Text>
        {description && <Box modifier="marginBottomKilo">{description}</Box>}
        <Box modifier="marginRowKilo">
            <Grid>
                <Column modifier="6">
                    {state &&
                        <Box modifier="marginBottom">
                            <Text element="h3" modifier="strong marginMilli">State</Text>
                            <Terminal>
                                <pre>{JSON.stringify(state, null, 4)}</pre>
                            </Terminal>
                        </Box>
                    }
                </Column>
                <Column modifier="6">
                    {children}
                </Column>
            </Grid>
        </Box>
        {cleanedSource &&
            <Box>
                <Text element="h3" modifier="strong marginMilli">Example code</Text>
                <Terminal modifier="code prism">
                    <pre dangerouslySetInnerHTML={{__html: Prism.highlight(cleanedSource, Prism.languages.jsx)}}/>
                </Terminal>
            </Box>
        }
    </Box>
}
