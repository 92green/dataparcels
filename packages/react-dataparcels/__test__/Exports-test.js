// @flow

// dataparcels exports
import Parcel from '../src/index';
import ChangeRequest from '../ChangeRequest';
import combine from '../combine';
import ParcelNode from '../ParcelNode';
import arrange from '../arrange';
import cancel from '../cancel';
import promisify from '../promisify';
import translate from '../translate';

// react-dataparcels
import Boundary from '../Boundary';
import ParcelDrag from '../ParcelDrag';
import useParcel from '../useParcel';
import useBuffer from '../useBuffer';

// internal dataparcels files
import InternalParcel from 'dataparcels';
import InternalChangeRequest from 'dataparcels/ChangeRequest';
import InternalCreateUpdater from 'dataparcels/combine';
import InternalParcelNode from 'dataparcels/ParcelNode';
import InternalAsNodes from 'dataparcels/arrange';
import Internalcancel from 'dataparcels/cancel';
import InternalPromisify from 'dataparcels/promisify';
import InternalTranslate from 'dataparcels/translate';

// internal react-dataparcels
import InternalBoundary from '../lib/Boundary';
import InternalParcelDrag from '../lib/ParcelDrag';
import InternalUseParcel from '../lib/useParcel';
import InternalUseBuffer from '../lib/useBuffer';

test('index should export Parcel', () => {
    expect(Parcel).toBe(InternalParcel);
});

test('/ChangeRequest should export ChangeRequest', () => {
    expect(ChangeRequest).toBe(InternalChangeRequest);
});

test('/combine should export combine', () => {
    expect(combine).toBe(InternalCreateUpdater);
});

test('/ParcelNode should export ParcelNode', () => {
    expect(ParcelNode).toBe(InternalParcelNode);
});

test('/arrange should export arrange', () => {
    expect(arrange).toBe(InternalAsNodes);
});

test('/cancel should export cancel', () => {
    expect(cancel).toBe(Internalcancel);
});

test('/promisify should export promisify', () => {
    expect(promisify).toBe(InternalPromisify);
});

test('/translate should export translate', () => {
    expect(translate).toBe(InternalTranslate);
});

test('/Boundary should export Boundary', () => {
    expect(Boundary).toBe(InternalBoundary);
});

test('/ParcelDrag should export ParcelDrag', () => {
    expect(ParcelDrag).toBe(InternalParcelDrag);
});

test('/useParcel should export useParcel', () => {
    expect(useParcel).toBe(InternalUseParcel);
});

test('/useBuffer should export useBuffer', () => {
    expect(useBuffer).toBe(InternalUseBuffer);
});
