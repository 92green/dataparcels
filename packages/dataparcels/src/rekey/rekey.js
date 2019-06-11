// @flow

// import type {ParcelDataEvaluator} from '../types/Types';
// import type {ParcelValueUpdater} from '../types/Types';

import dangerouslyUpdateParcelData from '../parcelData/dangerouslyUpdateParcelData';
// import parcelDataMap from '../parcelData/map';
// import parcelDataSetMeta from '../parcelData/setMeta';
// import parcelDataUpdate from '../parcelData/update';

// import composeWith from 'unmutable/composeWith';
// import map from 'unmutable/map';
// import pipeWith from 'unmutable/pipeWith';
// import toArray from 'unmutable/toArray';

type RekeyMap = {
    [matchPath: string]: boolean
};

export default (rekeyMap: RekeyMap) => dangerouslyUpdateParcelData(
    (parcelData) => {
        console.log("rekey", parcelData);
        return parcelData;
    }
);
