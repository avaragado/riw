// @flow

import mock from 'mock-fs';

import readDB from '../readDB';

const rdb: RIWDB = {
    version: 1,
    data: {},
};

const cfgBase: RIWConfig = {
    defaultLocale: 'aa-bb',
    targetLocales: [],
    translationsDatabaseFile: 'overwritten',
};

const stringify = obj => JSON.stringify(obj, null, 4);

describe('lib/riw/persistence/readDB', () => {
    beforeEach(() => {
        mock({
            fixtures: {
                '01': {}, // empty dir
                '02': {
                    'riw-db.json': 'not actually json',
                },
                '03': {
                    'riw-db.json': stringify(rdb),
                },
            },
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('fails to read a missing file', () => {
        const cfg = {
            ...cfgBase,
            translationsDatabaseFile: 'fixtures/01/riw-db.json',
        };

        expect(() => {
            readDB(cfg)();
        }).toThrowError(/ENOENT/);
    });

    it('fails to read a missing file - with explicit cwd', () => {
        const cfg = {
            ...cfgBase,
            rootDir: process.cwd(),
            translationsDatabaseFile: 'fixtures/01/riw-db.json',
        };

        expect(() => {
            readDB(cfg)();
        }).toThrowError(/ENOENT/);
    });

    it("throws if the file content isn't JSON", () => {
        const cfg = {
            ...cfgBase,
            translationsDatabaseFile: 'fixtures/02/riw-db.json',
        };

        expect(() => {
            readDB(cfg)();
        }).toThrowError(/Unexpected token/);
    });

    it('returns valid object if found', () => {
        const cfg = {
            ...cfgBase,
            translationsDatabaseFile: 'fixtures/03/riw-db.json',
        };

        expect(readDB(cfg)()).toEqual(rdb);
    });
});
