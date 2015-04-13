console.log("自定义任务 copy");
module.exports = function(grunt) {
	
  grunt.registerTask('test_copy', 'A sample task that just test copy.', function(arg1, arg2) {
		grunt.config.set("copy",{
				main:{
					files: [
				  		{expand: true,cwd:"src", src: ['*.html',"**/*.html"], dest: 'dist/'}
					]
				}
			});
		
		grunt.task.run("copy");
		//console.log("test copy set config");
	});
	
	//grunt.registerTask("my_copy",["test_copy","copy"]);

};