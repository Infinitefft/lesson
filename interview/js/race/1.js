Promise.myRace = function(iterable) {
    return new Promise((resolve, reject) => {
        for (const item of iterable) {
            // 万无一失
            Promise.resolve(item).then(resolve, reject)
        }
    })
}