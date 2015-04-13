console.log("自定义任务 usemin");
module.exports = function(grunt) {
	
	grunt.config.set("useminPrepare",{
		foo: {
			src: ['src/index.html']
	  	},
	});
	
	
	grunt.config.set("usemin",{
	  html: 'dist/index.html'
	});
	
  grunt.registerTask('test_usemin', [
  	  "test_clean",
	  "test_copy",
	  'useminPrepare',
	  'concat:generated',
	  'cssmin:generated',
	  'uglify:generated',
	  //'filerev',
	  'usemin'
	]);



};