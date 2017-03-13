// @flow

// these tests can't use mock-fs as the code uses require to allow users
// to write node modules that export configuration, and those modules might
// need other resources, eg babel. mock-fs 4.1.x replaces the ENTIRE filesystem,
// it doesn't overlay a mock one on the real one -- so those modules and the node
// core have no access to files not mocked.

import path from 'path';

import configFromPath from '../';

const dabsFixtures = path.resolve(__dirname, 'fixtures');

const frelF02Good = path.join('01', 'test-config.js');
const frelF02Bad = path.join('01', 'test-config-missing.js');
const fabsF02Good = path.resolve(dabsFixtures, frelF02Good);
const fabsF02Bad = path.resolve(dabsFixtures, frelF02Bad);

const configOverrideF02 = require(fabsF02Good);

describe('lib/config/fromPath', () => {
    let cwd;

    beforeEach(() => {
        cwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(cwd);
    });

    it('should return the merged config: absolute, good file', () => {
        expect(configFromPath(fabsF02Good)).toEqual({
            ...configOverrideF02,
            configFile: fabsF02Good,
        });
    });

    it('should return the merged config: relative, good file', () => {
        process.chdir(dabsFixtures);

        expect(configFromPath(frelF02Good)).toEqual({
            ...configOverrideF02,
            configFile: fabsF02Good,
        });
    });

    it('should return null: absolute, missing file', () => {
        expect(configFromPath(fabsF02Bad)).toBeNull();
    });

    it('should return null: relative, missing file', () => {
        process.chdir(dabsFixtures);

        expect(configFromPath(frelF02Bad)).toBeNull();
    });
});
