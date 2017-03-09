// @flow

import mock from 'mock-fs';

import dbRead from '../dbRead';
import cfgBase from '../../../__tests__/helpers/dummyConfig';

const db: RIWDB = {
    version: 1,
    data: {},
};

const stringify = obj => JSON.stringify(obj, null, 4);

describe('lib/riw/db/rw/dbRead', () => {
    beforeEach(() => {
        mock({
            fixtures: {
                '01': {}, // empty dir
                '02': {
                    'riw-db.json': 'not actually json',
                },
                '03': {
                    'riw-db.json': stringify(db),
                },
            },
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('fails to read a missing file', () => {
        const cfg: RIWConfig = {
            ...cfgBase,
            translationsDatabaseFile: 'fixtures/01/riw-db.json',
        };

        expect(() => {
            dbRead(cfg)();
        }).toThrowError(/ENOENT/);
    });

    it('fails to read a missing file - with explicit cwd', () => {
        const cfg: RIWConfig = {
            ...cfgBase,
            rootDir: process.cwd(),
            translationsDatabaseFile: 'fixtures/01/riw-db.json',
        };

        expect(() => {
            dbRead(cfg)();
        }).toThrowError(/ENOENT/);
    });

    it("throws if the file content isn't JSON", () => {
        const cfg: RIWConfig = {
            ...cfgBase,
            translationsDatabaseFile: 'fixtures/02/riw-db.json',
        };

        expect(() => {
            dbRead(cfg)();
        }).toThrowError(/Unexpected token/);
    });

    it('returns valid object if found', () => {
        const cfg: RIWConfig = {
            ...cfgBase,
            translationsDatabaseFile: 'fixtures/03/riw-db.json',
        };

        expect(dbRead(cfg)()).toEqual(db);
    });
});
