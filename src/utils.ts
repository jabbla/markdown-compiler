export function indexBy(key: string, list: any[]) {
    return list.reduce((prev, cur) => {
        prev[cur[key]] = cur;
        return prev;
    }, {});
}
