function toCamel(str) {
    return str.replace(/-(\w)/g, (_, tar) => {
        return tar.toUpperCase();
    })
}
console.log(toCamel('background-color'));
console.log(toCamel('-webkit-animation-name'));