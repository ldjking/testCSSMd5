console.log("自定义任务");
module.exports = function(grunt) {
	
  grunt.registerTask('test_uglify', 'A sample task that just test uglify.', function(arg1, arg2) {
		grunt.config.set("uglify",{
				options: {
					//banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'//添加banner
				},
				dist: {//任务一：压缩a.js，不混淆变量名，保留注释，添加banner和footer
					options: {
						mangle: true, //不混淆变量名
						preserveComments: ' false', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
					},
					files: {
						'dist/js/aio.js': ['src/js/aio.js']
					}
				}
			});
		
		grunt.task.run("uglify");
		//console.log("test copy set config");
	});
	
	//grunt.registerTask("my_copy",["test_copy","copy"]);

};