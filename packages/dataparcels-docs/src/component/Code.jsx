// @flow
import React from 'react';
import type {Node} from 'react';
import Prism from 'prismjs';
import {Text} from 'dcme-style';

require(`prismjs/components/prism-flow.js`);
require(`prismjs/components/prism-jsx.js`);

type Props = {
    children: Node,
    language: string,
    modifier?: string
};

export default class Code extends React.Component<Props> {
    render(): Node {
        let {children, modifier = "", language} = this.props;
        let __html = Prism.highlight(children, Prism.languages[language], 'language');
        return <Text modifier={`code prism-${language}`}>
            <span dangerouslySetInnerHTML={{__html}} />
        </Text>;
    }
}
