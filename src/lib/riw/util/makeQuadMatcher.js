// @flow

export default (match: RIWQuadMatcher) => (quad: RIWDBQuad): boolean => (
    (!match.defaultMessage || quad[0] === match.defaultMessage) &&
    (!match.description || quad[1] === match.description) &&
    (!match.locale || quad[2] === match.locale) &&
    (!match.translation || quad[3] === match.translation)
);
