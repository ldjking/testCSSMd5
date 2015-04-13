process.on('uncaughtException', function(e) {
  console.log("server on error");　　
  console.log(e);
});

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    css_import: {
      files: {
        'dist/all.css': ['src/css/mod/pageA/pageA.css'],
      },
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        sourceMap: true,
        advanced: false,
        aggressiveMerging: false,
        debug: true,
        restructuring: false,
        roundingPrecision: -1,
        rebase: true
      },
      target: {
        files: {
          'dist/all.css': ['src/css/mod/pageA/pageA.css'],
        }
      }
    }
  });



  //grunt.task.loadTasks("grunt_tasks/test2");

  // 加载所有grunt任务的插件。
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['cssbuild']);

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    if (/\.tpl$/.test(filepath) && !/deleted/.test(action)) {
      //如果是tpl文件 且不是删除动作
      grunt.config('compile.src', filepath);
    }
  });

  grunt.registerTask('hello', 'A sample task that just say hello.', function(arg1, arg2) {
    console.log("hello");
  });

  grunt.registerTask('cssbuild', 'build css files', function(arg1, arg2) {
    var files = grunt.file.expand(["src/**/*.jsp", "src/**/*.html"]);
    console.log("jsp files:", files);
    for (var i = 0; i < files.length; i++) {
      parseJsp(files[i]);
    }
  });

  function parseCssPath(file, cssFile) {
    var path = require("path");
    if (cssFile) {
      //console.log("cssFile", cssFile);
      var cssPath = path.join(file, "../",cssFile);
      //console.log("cssPath", cssPath);
      return cssPath;
    } else {
      console.log("不是有效的css link标签");
    }
  }

  function parseJsp(file) {
    var fileContent = grunt.file.read(file);

    var cssFiles = fileContent.match(/<link.*?rel="stylesheet".*?>/ig);
    console.log("cssFiles", cssFiles);
    var mapings=[];
    for (var i = 0; i < cssFiles.length; i++) {
      var cssHref = (/href=['"](.*)?['"]/ig).exec(cssFiles[i]);
      var maping=buildCss(file, cssHref);
      mapings.push(maping);
    }


    var afterRevision=addJSPRevision(file,fileContent,mapings);//修改版本号的jsp内容
    //console.log("afterRevision",afterRevision);

    var destFile=file.replace("src","dist");
    grunt.file.write(destFile,afterRevision);
    return mapings;
  }

  function buildCss(file, cssHref) {
    var CleanCSS=require("clean-css");
    var MD5=require("MD5");
    var PATH=require("path");
    cssHref=(cssHref&&cssHref[1])||"";
    var cssPath = parseCssPath(file, cssHref);
    var cssSrc = cssPath.replace(/\\/g, "/");

    console.log("cssSrc",cssSrc);
    //grunt.config.set("css_import", conf);
    //grunt.task.run("css_import");
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

    console.log("shortMd5",shortMd5);
    console.log("cssDest",cssDest);

    grunt.file.write(cssDest, compiledCssString);//产生了一个新的css文件
    //修改jsp的css文件版本号  当有多个css文件时  要增量替换
    return {
      key:cssHref,
      value:cssHref.replace(".css","."+shortMd5+".css")
    };
  }

  function addJSPRevision(file,fileContent,mapings){//给jsp文件css引用加上版本号
    console.log("maping",mapings);
    for(var i=0;i<mapings.length;i++){
      var map=mapings[i];
      fileContent=fileContent.replace(map.key,map.value);
    }
    return fileContent;
  }

};