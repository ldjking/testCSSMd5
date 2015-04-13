var compile=require("./compile");
console.log(compile);


var fs=require("fs");
var file=fs.readFileSync("./index.tpl",{encoding:"utf8"});
var result=compile.template(file);

var beautify=require("js-beautify");
console.log(beautify);
console.log(result);