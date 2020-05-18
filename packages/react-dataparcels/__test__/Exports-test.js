// @flow

// dataparcels exports
import Parcel from '../src/index';
import ChangeRequest from '../ChangeRequest';
import combine from '../combine';
import cancel from '../cancel';
import promisify from '../promisify';
import translate from '../translate';

// react-dataparcels
import Boundary from '../Boundary';
import Drag from '../Drag';
import useParcel from '../useParcel';
import useBuffer from '../useBuffer';

// internal dataparcels files
import InternalParcel from 'dataparcels';
import InternalChangeRequest from 'dataparcels/ChangeRequest';
import InternalCreateUpdater from 'dataparcels/combine';
import Internalcancel from 'dataparcels/cancel';
import InternalPromisify from 'dataparcels/promisify';
import InternalTranslate from 'dataparcels/translate';

// internal react-dataparcels
import InternalBoundary from '../lib/Boundary';
import InternalDrag from '../lib/Drag';
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

test('/Drag should export Drag', () => {
    expect(Drag).toBe(InternalDrag);
});

test('/useParcel should export useParcel', () => {
    expect(useParcel).toBe(InternalUseParcel);
});

test('/useBuffer should export useBuffer', () => {
    expect(useBuffer).toBe(InternalUseBuffer);
});
