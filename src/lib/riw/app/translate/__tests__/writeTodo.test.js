// @flow

import fs from 'fs';

import mock from 'mock-fs';

import type { TranslationLookupResult } from '../findTranslations';
import { configResolve } from '../../../../config';

import writeTodo from '../writeTodo';

const parse = frel => JSON.parse(fs.readFileSync(frel).toString());
const notify = () => x => x;

describe('lib/riw/app/translate/writeTodo', () => {
    afterEach(() => {
        mock.restore();
    });

    it('01 throws if it cannot create the parent directory', () => {
        const translation: TranslationLookupResult = {
            locale: {},
            todos: [],
        };
        const cfg = configResolve({
            outputMode: 'file-per-locale',
            todoFile: 'fixtures/dir/foobar/md-todo.json',
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
            writeTodo(cfg, notify)(translation);
        }).toThrowError('EACCES');
    });

    it('02 writes a file, if configured as file-per-locale', () => {
        const translation: TranslationLookupResult = {
            locale: {},
            todos: [
                { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'bb-bb', file: '/some/root/foo/bar.js' },
                { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'cc-cc', file: '/some/root/foo/bar.js' },
                { id: 's.2', defaultMessage: 'aa-aa s.2', description: 's.2 desc', locale: 'cc-cc', file: '/some/root/foo/bar.js' },
            ],
        };

        // files become relative to rootDir on write
        const todosWritten = [
            { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'bb-bb', file: 'foo/bar.js' },
            { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'cc-cc', file: 'foo/bar.js' },
            { id: 's.2', defaultMessage: 'aa-aa s.2', description: 's.2 desc', locale: 'cc-cc', file: 'foo/bar.js' },
        ];

        const cfg = configResolve({
            rootDir: '/some/root',
            outputMode: 'file-per-locale',
            todoFile: 'fixtures/dir/md-todo.json',
        });

        mock({
            '/some/root': {
                'fixtures': {
                    'dir': {}, // empty dir
                },
            },
        });

        expect(() => {
            writeTodo(cfg, notify)(translation);
        }).not.toThrow();

        const arfrel = fs.readdirSync('/some/root/fixtures/dir');

        expect(arfrel).toEqual(['md-todo.json']);

        expect(parse('/some/root/fixtures/dir/md-todo.json')).toEqual(todosWritten);
    });

    it('03 writes a file, if configured as single-file', () => {
        const translation: TranslationLookupResult = {
            locale: {},
            todos: [
                { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'bb-bb', file: '/some/root/foo/bar.js' },
                { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'cc-cc', file: '/some/root/foo/bar.js' },
                { id: 's.2', defaultMessage: 'aa-aa s.2', description: 's.2 desc', locale: 'cc-cc', file: '/some/root/foo/bar.js' },
            ],
        };

        // files become relative to rootDir on write
        const todosWritten = [
            { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'bb-bb', file: 'foo/bar.js' },
            { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'cc-cc', file: 'foo/bar.js' },
            { id: 's.2', defaultMessage: 'aa-aa s.2', description: 's.2 desc', locale: 'cc-cc', file: 'foo/bar.js' },
        ];

        const cfg = configResolve({
            rootDir: '/some/root',
            outputMode: 'single-file',
            todoFile: 'fixtures/dir/md-todo.json',
        });

        mock({
            '/some/root': {
                'fixtures': {
                    'dir': {}, // empty dir
                },
            },
        });

        expect(() => {
            writeTodo(cfg, notify)(translation);
        }).not.toThrow();

        const arfrel = fs.readdirSync('/some/root/fixtures/dir');

        expect(arfrel).toEqual(['md-todo.json']);

        expect(parse('/some/root/fixtures/dir/md-todo.json')).toEqual(todosWritten);
    });

    it('04 writes no file if configured as no-file', () => {
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
            outputMode: 'no-file',
            todoFile: 'fixtures/dir/md-todo.json',
        });

        mock({
            fixtures: {
                'dir': {}, // empty dir
            },
        });

        expect(() => {
            writeTodo(cfg, notify)(translation);
        }).not.toThrow();

        const arfrel = fs.readdirSync('fixtures/dir');

        expect(arfrel).toEqual([]);
    });

    it('05 overwrites existing file', () => {
        const translation: TranslationLookupResult = {
            locale: {},
            todos: [
                { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'bb-bb', file: '/some/root/foo/bar.js' },
                { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'cc-cc', file: '/some/root/foo/bar.js' },
                { id: 's.2', defaultMessage: 'aa-aa s.2', description: 's.2 desc', locale: 'cc-cc', file: '/some/root/foo/bar.js' },
            ],
        };

        // files become relative to rootDir on write
        const todosWritten = [
            { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'bb-bb', file: 'foo/bar.js' },
            { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'cc-cc', file: 'foo/bar.js' },
            { id: 's.2', defaultMessage: 'aa-aa s.2', description: 's.2 desc', locale: 'cc-cc', file: 'foo/bar.js' },
        ];

        const cfg = configResolve({
            rootDir: '/some/root',
            outputMode: 'single-file',
            todoFile: 'fixtures/dir/md-todo.json',
        });

        mock({
            '/some/root': {
                'fixtures': {
                    'dir': {
                        'md-todo.json': 'OLD',
                    },
                },
            },
        });

        expect(() => {
            writeTodo(cfg, notify)(translation);
        }).not.toThrow();

        const arfrel = fs.readdirSync('/some/root/fixtures/dir');

        expect(arfrel).toEqual(['md-todo.json']);

        expect(parse('/some/root/fixtures/dir/md-todo.json')).toEqual(todosWritten);
    });

    it('06 returns its input', () => {
        const translation: TranslationLookupResult = {
            locale: {},
            todos: [
                { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'bb-bb', file: '/some/root/foo/bar.js' },
                { id: 's.1', defaultMessage: 'aa-aa s.1', description: 's.1 desc', locale: 'cc-cc', file: '/some/root/foo/bar.js' },
                { id: 's.2', defaultMessage: 'aa-aa s.2', description: 's.2 desc', locale: 'cc-cc', file: '/some/root/foo/bar.js' },
            ],
        };

        const cfg = configResolve({
            rootDir: '/some/root',
            outputMode: 'single-file',
            todoFile: 'fixtures/dir/md-todo.json',
        });

        mock({
            '/some/root': {
                'fixtures': {
                    'dir': {}, // empty dir
                },
            },
        });

        const received = writeTodo(cfg, notify)(translation);

        expect(received).toEqual(translation);
    });

});
