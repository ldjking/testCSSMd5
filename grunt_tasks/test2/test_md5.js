console.log("自定义任务 usemin");
module.exports = function(grunt) {
  var target=["dist/*.html"];
  grunt.registerTask('myRev', 'A sample task that just test file rev.', function(arg1, arg2) {
		var files=grunt.file.expand(target);
		console.log(files);
		
		for(var i=0;i<files.length;i++){
			rs_md5(files[i]);
		}
		
		//console.log("test copy set config");
	});

  function rs_md5(file){
	  var text=grunt.file.read(file);
	  //console.log("text:",text);
	  var reg=/<link[\s\S]*?href=([\s\S]*)/g
	  
	  text.replace(/<(link|script|img)[\s\S]*?>/ig,function(a,b,c){
		  	console.log("a",a);
			//console.log("b",b);
			//console.log("c",c);
			//var path=
		  	
		})
  }
  //grunt.registerTask("my_copy",["test_copy","copy"]);



};