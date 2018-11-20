// @flow

//
// top be refined and moved to react-cool-storage!!!!!!
//

import type {ComponentType} from 'react';
import type {Node} from 'react';

import React from 'react';
import map from 'unmutable/lib/map';

type Config = {
    method: string,
    name: string
};

type Props = {
    history: {
        push: Function,
        replace: Function
    },
    location: {
        search: string
    }
};

export default (config: Config) => {
    let {
        method = "push",
        name
    } = config;

    return (Component: ComponentType<*>) => class ReactRouterQueryStringHoc extends React.Component<Props> {

        handleChange = (newValue: *) => {
            let {history} = this.props;
            let searchParams = new URLSearchParams();

            map((value, key) => {
                searchParams.set(key, value);
            })(newValue);

            history[method]("?" + searchParams.toString());
        }

        render(): Node {

            let {
                history,
                location
            } = this.props;

            if(!history || !location) {
                throw new Error(`ReactRouterQueryStringHoc requires React Router history and location props`);
            }

            let query = {};
            let searchParams = new URLSearchParams(location.search);
            for (let [key, value] of searchParams) {
                query[key] = value;
            }

            let childProps = {
                [name]: {
                    value: query,
                    onChange: this.handleChange
                }
            };

            return <Component
                {...this.props}
                {...childProps}
            />;
        }
    }
};
