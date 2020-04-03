// @flow
import React from 'react';
import Page from 'component/Page';
import {H1} from 'dcme-style';
import {ContentNav} from 'dcme-style';

import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

export default function PersonEditor() {

    let [personParcel] = useParcelState({
        value: {
            firstname: "Robert",
            lastname: "Clamps"
        }
    });

    personParcel = personParcel
        .modifyUp(({changeRequest}) => {
            // cause the change request reducer to re-execute the same effect again
            changeRequest.nextData;
        })
        .modifyUp(({value}) => {
            let {firstname} = value;
            return {
                effect: async (update) => {
                    await new Promise(resolve => setTimeout(resolve, firstname.length > 2 ? 0 : 1000));

                    update(({value}) => ({
                        value: {
                            ...value,
                            lastname: firstname
                        }
                    }));
                }
            };
        });

    return <Page>
        <ContentNav
            pageTop
            pageBottom
            mdxHeading
        >
            <H1>Dev page</H1>
            <label>firstname</label>
            <ParcelBoundary parcel={personParcel.get('firstname')}>
                {(firstname) => <input type="text" {...firstname.spreadInput()} />}
            </ParcelBoundary>

            <label>lastname</label>
            <ParcelBoundary parcel={personParcel.get('lastname')}>
                {(lastname) => <input type="text" {...lastname.spreadInput()} />}
            </ParcelBoundary>
        </ContentNav>
    </Page>;
}
