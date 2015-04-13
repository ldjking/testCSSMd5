console.log("自定义任务");
module.exports = function(grunt) {
	
  grunt.registerTask('test_inline', 'A sample task that just test inline.', function(arg1, arg2) {
		grunt.config.set("inline",{
				 dist: {
					src: ['src/index.html'],
					dest: ['dist/']
				}
			});
		
		grunt.task.run("inline");
		//console.log("test copy set config");
	});
	
	//grunt.registerTask("my_copy",["test_copy","copy"]);

};