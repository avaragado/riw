// @flow

import path from 'path';

import { fabsConfigPackageForCWD } from '../';

describe('lib/config/fabsConfigPackageForCWD', () => {
    let cwd;

    beforeEach(() => {
        cwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(cwd);
    });

    const dabsF01: AbsolutePath = path.resolve(__dirname, 'fixtures', '01-pkg-ok');
    const fabsF01Expected = path.resolve(dabsF01, '.riw-config.js');

    it('should return the path to the package .riw-config.js from a package subdir', () => {
        process.chdir(path.resolve(dabsF01, 'subdir'));

        expect(fabsConfigPackageForCWD()).toBe(fabsF01Expected);
    });

    it('should return the path to the package .riw-config.js from the package root', () => {
        process.chdir(path.resolve(dabsF01));

        expect(fabsConfigPackageForCWD()).toBe(fabsF01Expected);
    });

    it('should return null if no root dir found', () => {
        process.chdir(path.resolve('/tmp'));

        expect(fabsConfigPackageForCWD()).toBeNull();
    });
});
