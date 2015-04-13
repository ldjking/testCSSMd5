console.log("自定义任务 compile tpl");
module.exports = function(grunt) {
	function tplChange(f, curr, prev) { //服务变化
	  if (typeof f == "object" && prev === null && curr === null) {
	    // Finished walking the tree
	  } else if (prev === null) {
	    // f is a new file
	    // var rs=require(f);
	  } else if (curr.nlink === 0) {
	    console.log("handler file delete " + f);
	    delete require.cache[f]; //删除

	  } else {
	    console.log("handler file change " + f);
	    delete require.cache[f];
	    //var rs = require(f); //重新加载改资源  确保下次使用能快速
	    //console.log(rs.toString());
	  }
	}

  grunt.registerTask('compile', 'A sample task that just compile tpl to js', function(arg1, arg2) {
  		console.log("grunt config",grunt.config.get("compile"));
  		var conf=grunt.config.get("compile");
  		if(conf){
  			var file=grunt.config.get("compile").src;//变更内容
  		}
  		if(file){/*单独编译该tpl文件 输出编译后的tpl模板*/
			var compile=require("../lib/compile");
			//console.log(compile);
			var fileContent=grunt.file.read(file);
  			var result=compile.template(fileContent);
  			var targetFile=file.replace(/\.tpl$/,".js");
  			grunt.file.write(targetFile,result);
  		}
	});

};