// @flow
import React from 'react';
import {useRef} from 'react';
import Page from 'component/Page';
import {H1} from 'dcme-style';
import {ContentNav} from 'dcme-style';

import promisify from 'react-dataparcels/promisify';
import useParcel from 'react-dataparcels/useParcel';
import Boundary from 'react-dataparcels/Boundary';

export default function PersonEditor() {

    let rejectRef = useRef();

    let personParcel = useParcel({
        // source: () => ({
        //     value: {
        //         firstname: "Robert",
        //         lastname: "Clamps",
        //         saves: 0
        //     }
        // }),
        source: promisify({
            key: 'load',
            effect: async () => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return {
                    value: {
                        firstname: "Robert",
                        lastname: "Clamps",
                        saves: 0
                    }
                };
            }
        }),
        onChange: promisify({
            key: 'save',
            effect: async ({value}) => {
                await new Promise(resolve => setTimeout(resolve, 1000));

                if(rejectRef.current) {
                    rejectRef.current = false;
                    throw new Error('NO!!!');
                }

                return {
                    value: {
                        ...value,
                        saves: value.saves + 1
                    }
                };
            },
            revert: true
        }),
        buffer: true
    });

    return <Page>
        <ContentNav
            pageTop
            pageBottom
            mdxHeading
        >
            <H1>Dev page</H1>
            <div>load status {personParcel.meta.loadStatus}</div>

            {personParcel.value &&
                <>
                    <div>firstname</div>
                    <Boundary source={personParcel.get('firstname')}>
                        {(firstname) => <input type="text" {...firstname.spreadInput()} />}
                    </Boundary>

                    <div>lastname</div>
                    <Boundary source={personParcel.get('lastname')}>
                        {(lastname) => <input type="text" {...lastname.spreadInput()} />}
                    </Boundary>

                    <div>save status {personParcel.meta.saveStatus}</div>
                    <div>save error {personParcel.meta.saveError && personParcel.meta.saveError.message}</div>
                    <div>saves {personParcel.value.saves}</div>

                    <div>
                        <button onClick={personParcel.meta.submit}>submit</button>
                    </div>
                    <div>
                        <button onClick={() => {rejectRef.current = true;}}>reject</button>
                    </div>
                </>
            }
        </ContentNav>
    </Page>;
}
