// @flow

// import type ChangeRequest from 'dataparcels/ChangeRequest';
// import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useState is a named export of react
// import {useState} from 'react';
import Parcel from 'dataparcels';

type Config = {
    parcel: Parcel
};

type Return = [Parcel];

export default (config: Config): Return => {
    return [config.parcel];
};
