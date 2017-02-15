// @flow

const makeFilter = match => (quad: RIWDBQuad): boolean => (
    (!match.defaultMessage || quad[0] === match.defaultMessage) &&
    (!match.description || quad[1] === match.description) &&
    (!match.locale || quad[2] === match.locale) &&
    (!match.translation || quad[3] === match.translation)
);

// eslint-disable-next-line no-unused-vars
const transformer: RIWDBQuadsTransformer = (config, opt?: RIWCLIOptDBFind) => quads =>
    (opt
        ? quads.filter(makeFilter(opt.match))
        : quads
    );

export default transformer;
