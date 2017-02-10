// @flow

import fs from 'fs';

import mock from 'mock-fs';

import writeRDBFromConfig from '../writeRDB';

const rdb: RIWDB = {
    version: 1,
    data: {},
};

const cfgBase: RIWConfig = {
    defaultLocale: 'aa-bb',
    translationsDatabaseFile: 'overwritten',
};

const stringify = obj => JSON.stringify(obj, null, 4);

describe('lib/riw/writeRDB', () => {
    beforeEach(() => {
        mock({
            fixtures: {
                '01': {}, // empty dir
                '02': {
                    'riw-db.json': 'before',
                },
                '03': mock.directory({
                    mode: 0o555, // cannot write
                    items: {},
                }),
            },
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('writes a new rdb file to an empty dir', () => {
        const cfg = { ...cfgBase, translationsDatabaseFile: 'fixtures/01/riw-db.json' };
        const writeRDB = writeRDBFromConfig(cfg);

        expect(() => {
            writeRDB(rdb);
        }).not.toThrow();

        const content = fs.readFileSync(cfg.translationsDatabaseFile).toString();

        expect(content).toEqual(stringify(rdb));
    });

    it('writes a new rdb file to an empty dir - with explicit cwd', () => {
        const cfg = {
            ...cfgBase,
            dabsConfig: process.cwd(),
            translationsDatabaseFile: 'fixtures/01/riw-db.json',
        };
        const writeRDB = writeRDBFromConfig(cfg);

        expect(() => {
            writeRDB(rdb);
        }).not.toThrow();

        const content = fs.readFileSync(cfg.translationsDatabaseFile).toString();

        expect(content).toEqual(stringify(rdb));
    });

    it("doesn't overwrite an existing rdb file if told not to", () => {
        const cfg = { ...cfgBase, translationsDatabaseFile: 'fixtures/02/riw-db.json' };
        const writeRDB = writeRDBFromConfig(cfg, { allowOverwrite: false });

        expect(() => {
            writeRDB(rdb);
        }).toThrowError(/EEXIST/);
    });

    it("throws if it can't create a directory for the file", () => {
        const cfg = { ...cfgBase, translationsDatabaseFile: 'fixtures/03/impossible/riw-db.json' };
        const writeRDB = writeRDBFromConfig(cfg);

        expect(() => {
            writeRDB(rdb);
        }).toThrowError(/EACCES/);
    });
});
