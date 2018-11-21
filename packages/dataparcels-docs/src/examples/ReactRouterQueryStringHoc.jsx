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
    name: string,
    silent: boolean
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
        name,
        silent = false
    } = config;

    return (Component: ComponentType<*>) => class ReactRouterQueryStringHoc extends React.Component<Props> {

        checkAvailable = () => {
            if(typeof URLSearchParams === "undefined") {
                throw new Error(`ReactRouterQueryStringHoc requires URLSearchParams to be defined`);
            }

            let {
                history,
                location
            } = this.props;

            if(!history || !location) {
                throw new Error(`ReactRouterQueryStringHoc requires React Router history and location props`);
            }
        };

        handleChange = (newValue: *) => {
            let {history} = this.props;
            let searchParams = new URLSearchParams();

            map((value, key) => {
                searchParams.set(key, value);
            })(newValue);

            history[method]("?" + searchParams.toString());
        }

        render(): Node {

            let message = {
                value: {},
                onChange: () => {},
                available: false
            };

            try {
                this.checkAvailable();

                let query = {};
                let searchParams = new URLSearchParams(location.search);
                for (let [key, value] of searchParams) {
                    query[key] = value;
                }

                message = {
                    value: query,
                    onChange: this.handleChange,
                    available: true
                };

            } catch(e) {
                if(!silent) {
                    throw e;
                }
            }

            let childProps = {
                [name]: message
            };

            return <Component
                {...this.props}
                {...childProps}
            />;
        }
    }
};
