console.log("自定义任务 concat");
module.exports = function(grunt) {
	
  grunt.registerTask('test_concat', 'A sample task that just test concat.', function(arg1, arg2) {
		grunt.config.set("concat",{
				 dist: {
					  src: ['src/css/reset.css', 'src/css/common.css'],
					  dest: 'dist/css/aio.css',
					}
			});
		
		grunt.task.run("concat");
		//console.log("test copy set config");
	});
	
	//grunt.registerTask("my_copy",["test_copy","copy"]);

};