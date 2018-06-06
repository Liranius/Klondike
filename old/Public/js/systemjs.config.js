System.config({
    baseURL: ".",
    // paths: {
    //     "*": "*.js" // should load all libraries with .js appended
    // }
    // paths: {
    //     //path 将某个目录设置为一个简短的别名，在 map 选项里面可能会用到
    //     'npm:': 'node_modules'
    // },
    // map: {
    //     //map 控制 Systemjs 的加载器的加载位置
    //     //lib: 'lib'
    //     app: 'app'
    // },
    // meta: {
    //     '*.js': {
    //         format: 'system'
    //     }
    // },
    packages: {
        "": {
            // main: "main.js",
            // format: "system",
            defaultExtension: 'js'
        }
    }
});
