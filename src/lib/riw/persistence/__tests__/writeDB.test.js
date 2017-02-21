// @flow

import fs from 'fs';

import mock from 'mock-fs';

import writeDB from '../writeDB';
import cfgBase from '../../__tests__/helpers/dummyConfig';

const rdb: RIWDB = {
    version: 1,
    data: {},
};

const stringify = obj => JSON.stringify(obj, null, 4);

describe('lib/riw/persistence/writeDB', () => {
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

        expect(() => {
            writeDB(cfg)(rdb);
        }).not.toThrow();

        const content = fs.readFileSync(cfg.translationsDatabaseFile).toString();

        expect(content).toEqual(stringify(rdb));
    });

    it('writes a new rdb file to an empty dir - with explicit cwd', () => {
        const cfg = {
            ...cfgBase,
            rootDir: process.cwd(),
            translationsDatabaseFile: 'fixtures/01/riw-db.json',
        };

        expect(() => {
            writeDB(cfg)(rdb);
        }).not.toThrow();

        const content = fs.readFileSync(cfg.translationsDatabaseFile).toString();

        expect(content).toEqual(stringify(rdb));
    });

    it("doesn't overwrite an existing rdb file if told not to", () => {
        const cfg = { ...cfgBase, translationsDatabaseFile: 'fixtures/02/riw-db.json' };

        expect(() => {
            writeDB(cfg, { allowOverwrite: false })(rdb);
        }).toThrowError(/EEXIST/);
    });

    it("throws if it can't create a directory for the file", () => {
        const cfg = { ...cfgBase, translationsDatabaseFile: 'fixtures/03/impossible/riw-db.json' };

        expect(() => {
            writeDB(cfg)(rdb);
        }).toThrowError(/EACCES/);
    });
});
