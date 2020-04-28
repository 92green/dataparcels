// @flow
import React from 'react';
import {useState} from 'react';
import {useRef} from 'react';
import Page from 'component/Page';
import {H1} from 'dcme-style';
import {ContentNav} from 'dcme-style';

import promisify from 'react-dataparcels/promisify';
import useParcel from 'react-dataparcels/useParcel';
import Boundary from 'react-dataparcels/Boundary';

export default function PersonEditor() {

    let rejectRef = useRef();

    let [dep, setDep] = useState(0);

    let personParcel = useParcel({
        source: () => ({
            value: {
                firstname: "Robert",
                lastname: `Clamps ${dep}`,
                saves: 0
            }
        }),
        // source: promisify({
        //     key: 'load',
        //     effect: async () => {
        //         await new Promise(resolve => setTimeout(resolve, 1000));
        //         return {
        //             value: {
        //                 firstname: "Robert",
        //                 lastname: "Clamps",
        //                 saves: 0
        //             }
        //         };
        //     }
        // }),
        onChange: promisify({
            key: 'save',
            effect: async ({value, changeRequest}) => {
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log('value', value, changeRequest);

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
        dependencies: [dep],
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
                    <input type="text" {...personParcel.get('firstname').spreadInput()} />

                    <div>lastname</div>
                    <input type="text" {...personParcel.get('lastname').spreadInput()} />

                    <div>save status {personParcel.meta.saveStatus} error {personParcel.meta.saveError && personParcel.meta.saveError.message}</div>

                    <div>
                        <button onClick={personParcel.meta.submit}>submit</button>
                        {personParcel.meta.saveStatus === 'pending' && <button onClick={() => {rejectRef.current = true;}}>reject</button>}
                        <button onClick={personParcel.meta.reset}>reset</button>
                    </div>
                </>
            }

            <div>
                <button onClick={personParcel.meta.undo}>undo</button>
                <button onClick={personParcel.meta.redo}>redo</button>
                <button onClick={() => setDep(i => i + 1)}>receive</button>
            </div>
        </ContentNav>
    </Page>;
}
