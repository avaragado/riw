// @flow

import path from 'path';

import mock from 'mock-fs';

import dateMTimeFromFabs from '../dateMTimeFromFabs';

describe('lib/riw/project/status/dateMTimeFromFabs', () => {
    it('returns 0 if file does not exist', () => {
        mock({
            fixtures: {},
        });

        const received = dateMTimeFromFabs(path.resolve('fixtures', 'nope.json'));

        mock.restore();

        expect(received).toMatchSnapshot();
    });

    it('returns mtime if file exists', () => {
        mock({
            fixtures: {
                'foo.json': mock.file({
                    content: '[]',
                    mtime: new Date(2000),
                }),
            },
        });

        const received = dateMTimeFromFabs(path.resolve('fixtures', 'foo.json'));

        mock.restore();

        expect(received).toMatchSnapshot();
    });
});
