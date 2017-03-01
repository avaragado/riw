// @flow

import fs from 'fs';

import mock from 'mock-fs';

import writeFromDB from '../writeFromDB';
import cfgBase from '../../../__tests__/helpers/dummyConfig';

const db: RIWDB = {
    version: 1,
    data: {},
};

const stringify = obj => JSON.stringify(obj, null, 4);

describe('lib/riw/db/rw/writeFromDB', () => {
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

    it('writes a new db file to an empty dir', () => {
        const cfg = { ...cfgBase, translationsDatabaseFile: 'fixtures/01/riw-db.json' };

        expect(() => {
            writeFromDB(cfg)(db);
        }).not.toThrow();

        const content = fs.readFileSync(cfg.translationsDatabaseFile).toString();

        expect(content).toEqual(stringify(db));
    });

    it('writes a new db file to an empty dir - with explicit cwd', () => {
        const cfg = {
            ...cfgBase,
            rootDir: process.cwd(),
            translationsDatabaseFile: 'fixtures/01/riw-db.json',
        };

        expect(() => {
            writeFromDB(cfg)(db);
        }).not.toThrow();

        const content = fs.readFileSync(cfg.translationsDatabaseFile).toString();

        expect(content).toEqual(stringify(db));
    });

    it("doesn't overwrite an existing db file if told not to", () => {
        const cfg = { ...cfgBase, translationsDatabaseFile: 'fixtures/02/riw-db.json' };

        expect(() => {
            writeFromDB(cfg, { allowOverwrite: false })(db);
        }).toThrowError(/EEXIST/);
    });

    it("throws if it can't create a directory for the file", () => {
        const cfg = { ...cfgBase, translationsDatabaseFile: 'fixtures/03/impossible/riw-db.json' };

        expect(() => {
            writeFromDB(cfg)(db);
        }).toThrowError(/EACCES/);
    });
});
