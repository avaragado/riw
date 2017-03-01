// @flow

import mock from 'mock-fs';

import find from '../find';
import cfgBase from '../../__tests__/helpers/dummyConfig';

const cfg = {
    ...cfgBase,
    translationsDatabaseFile: 'db.json',
};

const db: RIWDB = {
    version: 1,
    data: {
        'one': {
            'desc1': {
                'aa-aa': '[aa-aa]1 one',
                'bb-bb': '[bb-bb]1 one',
            },
            'desc2': {
                'aa-aa': '[aa-aa]2 one',
                'bb-bb': '[bb-bb]2 one',
            },
        },
        'two': {
            'desc1': {
                'aa-aa': '[aa-aa]1 two',
                'bb-bb': '[bb-bb]1 two',
            },
        },
        'three': {
            'desc1': {
                'aa-aa': '[aa-aa]1 three',
                'cc-cc': '[cc-cc]1 three',
            },
        },
    },
};

const jsonDB = JSON.stringify(db, null, 4);

type Fixture = {
    name: string,
    opt: RIWCLIOptDBFind,
};

const fixtures: Fixture[] = [
    {
        name: '01 defaultMessage match',
        opt: {
            match: {
                defaultMessage: 'two',
            },
        },
    },

    {
        name: '02 description match',
        opt: {
            match: {
                description: 'desc1',
            },
        },
    },

    {
        name: '03 locale match',
        opt: {
            match: {
                locale: 'bb-bb',
            },
        },
    },

    {
        name: '04 translation match',
        opt: {
            match: {
                translation: '[cc-cc]1 three',
            },
        },
    },
];

describe('lib/riw/db/find', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                [cfg.translationsDatabaseFile]: jsonDB,
            });

            const received = find(cfg)(fixture.opt);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
