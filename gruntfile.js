process.on('uncaughtException', function(e) {
  console.log("server on error");　　
  console.log(e);
});

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  // 加载所有grunt任务的插件。
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // 加载包含 "uglify" 任务的插件。

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['cssbuild']);


  grunt.registerTask('cssbuild', 'build css files', function(arg1, arg2) {
	//需要处理的文件 包括jsp和html
    var files = grunt.file.expand(["src/**/*.jsp", "src/**/*.html"]);
    console.log("待处理文件", files);
    for (var i = 0; i < files.length; i++) {
      parseJsp(files[i]);//逐项处理
    }
  });

  function parseCssPath(file, cssFile) {//解析CSS路径
    var path = require("path");
	var cssPath;//待返回的cssPath
	
	cssFile=cssFile||"";
	cssFile=cssFile.replace(/\?.*$/,"");//清除后面已有的query版本号
	console.log("cssFile",cssFile);
    if (/^\$/g.test(cssFile)) {//这里要判断路径类型，jsp的是绝对路径
	  cssPath=cssFile.replace(/^\$.*?[\/|\\]/g,"src/");//替换规则
	  //todo 这里写替换规则
      return cssPath;
    }else{
	  cssPath = path.join(file, "../",cssFile);
      return cssPath;
    }
  }

  function parseJsp(file) {
    var fileContent = grunt.file.read(file);

    var cssFiles = fileContent.match(/<link.*?rel="stylesheet".*?>/ig);
    //console.log("cssFiles", cssFiles);
    var mapings=[];
    for (var i = 0; i < cssFiles.length; i++) {
      var cssHref = (/href=['"](.*)?['"]/ig).exec(cssFiles[i]);
      var maping=buildCss(file, cssHref);
      mapings.push(maping);
    }


    var afterRevision=addJSPRevision(file,fileContent,mapings);//修改版本号的jsp内容
    var destFile=file.replace("src","dist");//修改版本号后的文件存放位置  todo  要改成真实的规则
	
    grunt.file.write(destFile,afterRevision);//保存构建后的文件
    return mapings;//返回资源文件MD5映射
  }

  function buildCss(file, cssHref) {
    var CleanCSS=require("clean-css");
    var MD5=require("MD5");
    var PATH=require("path");
    cssHref=(cssHref&&cssHref[1])||"";
    var cssPath = parseCssPath(file, cssHref);
    var cssSrc = cssPath.replace(/\\/g, "/");

    //console.log("cssSrc",cssSrc);
    var options = {
      rebase: false,
      report: 'min',
      sourceMap: false,
      shorthandCompacting: false,
      sourceMap: false,
      keepBreaks:true,
      advanced: false,
      aggressiveMerging: false,
      debug: false,
      restructuring: false,
      roundingPrecision: -1,
      rebase: true
    };

    var cssDir=PATH.dirname(cssSrc);//css文件所在目录
    options.relativeTo=cssDir;//css合并时的图片相对路径重新构建


    try {
      var availableFiles=[cssSrc];
      compiled = new CleanCSS(options).minify(availableFiles);
    } catch (err) {
      grunt.log.error(err);
      grunt.warn('CSS minification failed');
    }

    var compiledCssString = compiled.styles;
    var md5Str=MD5(compiledCssString);


    var shortMd5=md5Str.substr(0,6);
    var cssDest = cssSrc.replace("src", "dist").replace(".css","."+shortMd5+".css");

    //console.log("shortMd5",shortMd5);
    //console.log("cssDest",cssDest);

    grunt.file.write(cssDest, compiledCssString);//产生了一个新的css文件
    //修改jsp的css文件版本号  当有多个css文件时  要增量替换
    return {
      key:cssHref,
      value:cssHref.replace(".css","."+shortMd5+".css").replace(/\?.*?$/g,"")
    };
  }

  function addJSPRevision(file,fileContent,mapings){//给jsp文件css引用加上版本号
    //console.log("maping",mapings);
    for(var i=0;i<mapings.length;i++){
      var map=mapings[i];
      fileContent=fileContent.replace(map.key,map.value);
    }
    return fileContent;
  }

};