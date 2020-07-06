/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/prop-types */
import type {Node} from 'react';
import React from 'react';

import {Paper} from 'dcme-style';
import {Button} from 'dcme-style/affordance';
import {Box} from 'dcme-style/layout';

type Props = {
    children: Node,
    demoIndex: number,
    setDemoIndex: (index: number) => void,
    demos: any[]
};

export default (props: Props): Node => {
    let i = 0;
    return <Paper
        display={["block","flex"]}
        flexWrap="wrap"
    >
        <Box flexGrow={1}>
            {props.children}
        </Box>
        <Paper
            overflow="auto"
            textStyle="monospace"
            bg="bgAlt2"
            textSize="s"
            flexGrow={1}
            flexShrink={0}
            minWidth="20rem"
            mt="2.2rem"
        >
            {props.demos.map((demo, index) => {
                if(typeof demo === 'string') {
                    return <Box mb={1} py={2} px={3}>
                        {demo}
                    </Box>;
                }
                i++;
                let onClick = () => props.setDemoIndex(index);
                return <Box mb={1}>
                    <Button onClick={onClick} invert={props.demoIndex === index}>{i}. {demo.title}</Button>
                </Box>;
            })}
        </Paper>
    </Paper>;
};
