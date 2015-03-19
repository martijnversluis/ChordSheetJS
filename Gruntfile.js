module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        coffee: {
            compile: {
                files: {
                    '<%= pkg.name %>.js': '<%= pkg.name %>.coffee'
                }
            },

            options: { sourceMap: true }
        },

        uglify: {
            build: {
                src: '<%= pkg.name %>.js',
                dest: '<%= pkg.name %>.min.js'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.registerTask('build', ['coffee', 'uglify']);
};
