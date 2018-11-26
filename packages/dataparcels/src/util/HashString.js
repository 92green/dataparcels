// @flow

export default (str: string, max?: number): number => {
    var hash = 0;
    if (!str.length) return hash;
    for (var i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(max ? hash % max : hash);
};
