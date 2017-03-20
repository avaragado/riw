// @flow

import type { TranslationQuad } from '../../../../../types';
import armdtFromQuadAr from '../armdtFromQuadAr';

type Fixture = {
    name: string,
    in: TranslationQuad[],
};

const fixtures: Fixture[] = [
    {
        name: '01 no quads',
        in: [],
    },

    {
        name: '02 some quads',
        in: [
            ['one', 'desc1', 'aa-aa', '[aa-aa]1 one'],
            ['one', 'desc2', 'aa-aa', '[aa-aa]2 one'],
            ['one', 'desc1', 'bb-bb', '[bb-bb]1 one'],
            ['one', 'desc2', 'bb-bb', '[bb-bb]2 one'],
            ['two', 'desc1', 'aa-aa', '[aa-aa]1 two'],
            ['two', 'desc1', 'bb-bb', '[bb-bb]1 two'],
            ['three', 'desc1', 'aa-aa', '[aa-aa]1 three'],
            ['three', 'desc1', 'cc-cc', '[cc-cc]1 three'],
            ['four', '_', 'aa-aa', '[aa-aa]no desc four'],
            ['four', 'desc1', 'aa-aa', '[aa-aa]1 four'],
        ],
    },
];

describe('lib/riw/db/transform/armdtFromQuadAr', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const received = armdtFromQuadAr(fixture.in);

            expect(received).toMatchSnapshot();
        });
    });
});
