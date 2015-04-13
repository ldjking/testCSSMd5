console.log("自定义任务");
module.exports = function(grunt) {
	
  grunt.registerTask('test_clean', 'A sample task that just test clean.', function(arg1, arg2) {
		console.log("test clean");
		console.log("args1",arg1);
		console.log("args2",arg2);
		
		grunt.config.set("clean",{
			  dist: ["dist/*"],
			  dev: ["dev/*"]
			});
		
		
		grunt.task.run("clean"+(arg1?":"+arg1:""));
	});

};