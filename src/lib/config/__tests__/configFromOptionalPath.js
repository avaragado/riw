// @flow

import path from 'path';

import { configFromOptionalPath, configDefault } from '../';

const dabsFixtures = path.resolve(__dirname, 'fixtures');

const frelF02Good = path.join('02-config-file', 'test-config.js');
const frelF02Bad = path.join('02-config-file', 'test-config-missing.js');
const fabsF02Good = path.resolve(dabsFixtures, frelF02Good);
const fabsF02Bad = path.resolve(dabsFixtures, frelF02Bad);

const configOverrideF02 = require(fabsF02Good);

describe('lib/config/configFromOptionalPath', () => {
    let cwd;

    beforeEach(() => {
        cwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(cwd);
    });

    it('should return the merged config: absolute, good file', () => {
        expect(configFromOptionalPath(fabsF02Good)).toEqual({
            ...configDefault,
            ...configOverrideF02,
            dabsConfig: path.dirname(fabsF02Good),
        });
    });

    it('should return the merged config: relative, good file', () => {
        process.chdir(dabsFixtures);

        expect(configFromOptionalPath(frelF02Good)).toEqual({
            ...configDefault,
            ...configOverrideF02,
            dabsConfig: path.dirname(fabsF02Good),
        });
    });

    it('should return null: absolute, missing file', () => {
        expect(configFromOptionalPath(fabsF02Bad)).toBeNull();
    });

    it('should return null: relative, missing file', () => {
        process.chdir(dabsFixtures);

        expect(configFromOptionalPath(frelF02Bad)).toBeNull();
    });

    it('should return the merged config: from package.json, key present', () => {
        const dabsF03 = path.resolve(dabsFixtures, '03-pkg-riw');
        const fabsF03PackageJSON = path.resolve(dabsF03, 'package.json');

        process.chdir(dabsF03);

        const configOverrideF03 = require(fabsF03PackageJSON).riw;

        expect(configFromOptionalPath(undefined)).toEqual({
            ...configDefault,
            ...configOverrideF03,
            dabsConfig: dabsF03,
        });
    });

    it('should return the merged config: from .riw-config, ignoring key in package.json', () => {
        const dabsF04 = path.resolve(dabsFixtures, '04-riw-config');
        const fabsF04 = path.resolve(dabsF04, '.riw-config');

        process.chdir(dabsF04);

        const configOverrideF04 = require(fabsF04);

        expect(configFromOptionalPath(undefined)).toEqual({
            ...configDefault,
            ...configOverrideF04,
            dabsConfig: dabsF04,
        });
    });

    it('should return default config: no .riw-config.js, but package.json with key not present', () => {
        const dabsF05 = path.resolve(dabsFixtures, '05-pkg-no-riw');

        process.chdir(dabsF05);

        expect(configFromOptionalPath(undefined)).toEqual({
            ...configDefault,
            dabsConfig: dabsF05,
        });
    });
});
