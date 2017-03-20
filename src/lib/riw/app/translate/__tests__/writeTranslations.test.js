// @flow

import fs from 'fs';

import mock from 'mock-fs';

import type { TranslationLookupResult } from '../findTranslations';
import { configResolve } from '../../../../config';

import writeTranslations from '../writeTranslations';

const parse = frel => JSON.parse(fs.readFileSync(frel).toString());
const notify = () => x => x;

describe('lib/riw/app/translate/writeTranslations', () => {
    afterEach(() => {
        mock.restore();
    });

    it('01 throws if config missing placeholder', () => {
        const translation: TranslationLookupResult = {
            locale: {},
            todos: [],
        };
        const cfg = configResolve({
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb'],
            translationsOutputFile: '/no/placeholder/here',
            outputMode: 'file-per-locale',
        });

        expect(() => {
            writeTranslations(cfg, notify)(translation);
        }).toThrowError('translationsOutputFile');
    });

    it('02 throws if it cannot create the parent directory', () => {
        const translation: TranslationLookupResult = {
            locale: {},
            todos: [],
        };
        const cfg = configResolve({
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb'],
            translationsOutputFile: 'fixtures/dir/foobar/[locale].json',
            outputMode: 'file-per-locale',
        });

        mock({
            fixtures: {
                'dir': mock.directory({
                    mode: 0o555, // cannot write
                    items: {},
                }),
            },
        });

        expect(() => {
            writeTranslations(cfg, notify)(translation);
        }).toThrowError('EACCES');
    });

    it('03 writes a file for each target locale, including default, if so configured', () => {
        const translation: TranslationLookupResult = {
            locale: {
                'aa-aa': {
                    's.1': 'aa-aa s.1',
                    's.2': 'aa-aa s.2',
                },
                'bb-bb': {
                    's.1': 'bb-bb s.1',
                    's.2': 'bb-bb s.2',
                },
                'cc-cc': {
                    's.1': 'cc-cc s.1',
                    's.2': 'cc-cc s.2',
                },
            },
            todos: [],
        };

        const cfg = configResolve({
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb', 'cc-cc', 'xx-xx'],
            translationsOutputFile: 'fixtures/dir/s-[locale].json',
            outputMode: 'file-per-locale',
        });

        mock({
            fixtures: {
                'dir': {}, // empty dir
            },
        });

        expect(() => {
            writeTranslations(cfg, notify)(translation);
        }).not.toThrow();

        const arfrel = fs.readdirSync('fixtures/dir');

        expect(arfrel).toEqual(['s-aa-aa.json', 's-bb-bb.json', 's-cc-cc.json', 's-xx-xx.json']);

        expect(parse('fixtures/dir/s-aa-aa.json')).toEqual(translation.locale['aa-aa']);
        expect(parse('fixtures/dir/s-bb-bb.json')).toEqual(translation.locale['bb-bb']);
        expect(parse('fixtures/dir/s-cc-cc.json')).toEqual(translation.locale['cc-cc']);
        expect(parse('fixtures/dir/s-xx-xx.json')).toEqual({});
    });

    it('04 writes a single file for all target locales, including default, if so configured', () => {
        const translation: TranslationLookupResult = {
            locale: {
                'aa-aa': {
                    's.1': 'aa-aa s.1',
                    's.2': 'aa-aa s.2',
                },
                'bb-bb': {
                    's.1': 'bb-bb s.1',
                    's.2': 'bb-bb s.2',
                },
                'cc-cc': {
                    's.1': 'cc-cc s.1',
                    's.2': 'cc-cc s.2',
                },
            },
            todos: [],
        };

        const cfg = configResolve({
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb', 'cc-cc', 'xx-xx'],
            translationsOutputFile: 'fixtures/dir/s-[locale].json',
            outputMode: 'single-file',
        });

        mock({
            fixtures: {
                'dir': {}, // empty dir
            },
        });

        expect(() => {
            writeTranslations(cfg, notify)(translation);
        }).not.toThrow();

        const arfrel = fs.readdirSync('fixtures/dir');

        expect(arfrel).toEqual(['s-locales.json']);

        const localeRebuilt = JSON.parse(fs.readFileSync('fixtures/dir/s-locales.json').toString());

        expect(localeRebuilt).toEqual({
            ...translation.locale,
            'xx-xx': {},
        });
    });

    it('05 writes no files if so configured', () => {
        const translation: TranslationLookupResult = {
            locale: {
                'aa-aa': {
                    's.1': 'aa-aa s.1',
                    's.2': 'aa-aa s.2',
                },
                'bb-bb': {
                    's.1': 'bb-bb s.1',
                    's.2': 'bb-bb s.2',
                },
                'cc-cc': {
                    's.1': 'cc-cc s.1',
                    's.2': 'cc-cc s.2',
                },
            },
            todos: [],
        };

        const cfg = configResolve({
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb', 'cc-cc', 'xx-xx'],
            translationsOutputFile: 'fixtures/dir/[locale].json',
            outputMode: 'no-file',
        });

        mock({
            fixtures: {
                'dir': {}, // empty dir
            },
        });

        expect(() => {
            writeTranslations(cfg, notify)(translation);
        }).not.toThrow();

        const arfrel = fs.readdirSync('fixtures/dir');

        expect(arfrel).toEqual([]);
    });

    it('06 overwrites existing files', () => {
        const translation: TranslationLookupResult = {
            locale: {
                'aa-aa': {
                    's.1': 'aa-aa s.1',
                    's.2': 'aa-aa s.2',
                },
                'bb-bb': {
                    's.1': 'bb-bb s.1',
                    's.2': 'bb-bb s.2',
                },
                'cc-cc': {
                    's.1': 'cc-cc s.1',
                    's.2': 'cc-cc s.2',
                },
            },
            todos: [],
        };

        const cfg = configResolve({
            defaultLocale: 'aa-aa',
            targetLocales: ['bb-bb', 'cc-cc', 'xx-xx'],
            translationsOutputFile: 'fixtures/dir/s-[locale].json',
            outputMode: 'file-per-locale',
        });

        mock({
            fixtures: {
                'dir': {
                    's-aa-aa.json': 'OLD',
                    's-bb-bb.json': 'OLD',
                    'another': 'foo',
                },
            },
        });

        expect(() => {
            writeTranslations(cfg, notify)(translation);
        }).not.toThrow();

        const arfrel = fs.readdirSync('fixtures/dir');

        expect(arfrel).toEqual(['another', 's-aa-aa.json', 's-bb-bb.json', 's-cc-cc.json', 's-xx-xx.json']);

        expect(parse('fixtures/dir/s-aa-aa.json')).toEqual(translation.locale['aa-aa']);
        expect(parse('fixtures/dir/s-bb-bb.json')).toEqual(translation.locale['bb-bb']);
        expect(parse('fixtures/dir/s-cc-cc.json')).toEqual(translation.locale['cc-cc']);
        expect(parse('fixtures/dir/s-xx-xx.json')).toEqual({});

        expect(fs.readFileSync('fixtures/dir/another').toString()).toEqual('foo');
    });

    it('07 returns its input', () => {
        const translation: TranslationLookupResult = {
            locale: {
                'aa-aa': {
                    's.1': 'aa-aa s.1',
                    's.2': 'aa-aa s.2',
                },
                'bb-bb': {
                    's.1': 'bb-bb s.1',
                    's.2': 'bb-bb s.2',
                },
                'cc-cc': {
                    's.1': 'cc-cc s.1',
                    's.2': 'cc-cc s.2',
                },
            },
            todos: [],
        };

        const cfg = configResolve({
            defaultLocale: 'aa-aa',
            translationsOutputFile: 'fixtures/dir/s-[locale].json',
            outputMode: 'file-per-locale',
        });

        mock({
            fixtures: {
                'dir': {}, // empty dir
            },
        });

        const received = writeTranslations(cfg, notify)(translation);

        expect(received).toEqual(translation);
    });

});
