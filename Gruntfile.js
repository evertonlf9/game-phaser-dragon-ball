/**
 * Created by everton.ferreira on 05/05/2017.
 */
module.exports = function(grunt){
    'use strict';

    //Subistitui o loadNpmTasks
    require('load-grunt-tasks')(grunt);
    //require('time-grunt')(grunt);

    grunt.initConfig({
        /**
         * Referencia package, bom para extrair informações
         */
        pkg: grunt.file.readJSON( 'package.json' ),

        App: {
            name: '<%= pkg.name %>',
            version: '<%= pkg.version %>',
            src: './src',
            dist: './dist',
            build: './build',
            dependencies: './node_modules/'
        },

        /**
         * Exclui todos os arquivos da pasta dist
         */
        clean: {
            dist: ['<%= App.dist%>', '.tmp'],
            build: ['<%= App.build%>', '.tmp']
        },

        wiredep: {
            dev: {
                src: [
                    '<%= App.src %>/index.html'
                ]
            }
        },

        /**
         * Copia conteúdo de 1 para 2
         * {@link https://github.com/gruntjs/grunt-contrib-copy#usage-examples exemplos}
         */
        copy:{
            //Copia de dist para dist
            dist:{
                expand: true,
                cwd: '<%= App.src%>',
                src: ['**', '!js/**', '!js/lib/**', '!js/scripts/**', '!js/vendor/**', '!css/**.css'],
                //src: '**',
                dest: '<%= App.dist%>'
            }
        },

        useminPrepare: {
            html: '<%= App.src %>/*.html',
            options: {
                dest: '<%= App.dist %>'
            }
        },

        usemin: {
            html: ['<%= App.dist %>/*.html']
        },

        /**
         * Minifica os htmls da dist
         */
        htmlmin: {
            options: {
                useShortDoctype: true,
                removeComments: true,
                removeTagWhitespace: true,
                removeEmptyAttributes: true,
                collapseInlineTagWhitespace: true,
                conservativeCollapse: true,
                collapseWhitespace: true
            },

            dist: {
                expand: true,
                cwd: '<%= App.dist %>',
                src: '*.html',
                dest: '<%= App.dist %>'
            }
        },

        /**
         * Minifica javascript
         * {@link https://github.com/gruntjs/grunt-contrib-uglify/blob/master/docs/uglify-examples.md exemplos}
         */
        uglify: {
            options: {
                preserveComments: 'some',
                sourceMap: true,
                sourceMapIncludeSources: true,
                //Comenta em que versão foi gerada.
                banner: '/*! <%= App.name %> - v<%= App.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= App.dist %>/',
                    src: ['**/*.js'],
                    dest: '<%= App.dist %>/'
                }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= App.dist %>/',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: '<%= App.dist %>/'
                }]
            }
        },

        compress: {
            build: {

                options: {
                    archive: '<%= App.build %>/<%= App.name %>_<%= pkg.version %>.zip'
                },
                files: [{
                    cwd: '<%= App.dist %>',
                    src: ['**'],
                    expand: true
                }]
            }
        },
        /**
         * Controle de versão
         * {@link https://github.com/gruntjs/grunt-contrib-jshint#usage-examples exemplos}
         */
        jshint:{
            dev:['<%= App.src %>**/*.js'],
            dist:['<%= App.build %>**/*.js']
        },

        /**
         * Controle de versão
         * {@link https://www.npmjs.com/package/grunt-version#usage-examples exemplos}
         */
        version: {
            project:{
                pkg: "package.json",
                src: ["package.json"]
            },
            options: {
                pkg: "package.json"
            }
        },

        /**
         * Livereload
         * {@link https://github.com/gruntjs/grunt-contrib-watch#optionslivereload exemplos}
         */
        watch: {
            //Configuração geral
            options: {
                spawn: false,
                forever: true
            },
            //Tratamentos para javascript
            js: {
                files: ['src/*.js'],
                //tasks: ['jshint:gruntfile'],
                tasks: ['jshint']
            },
            //Tratamentos para SASS
            css: {
                files: ['src/**/*.scss','src/**/*.css'],
                tasks: ['sass:dev']
            },
            // Impede que livereload altere bibliotecas
            dont:{
                files:['!<%= App.src %>lib/**/*.js','!<%= App.src %>lib/**/*.css','!<%= App.src %>lib/**/*.scss']
            }
        }
    });

    grunt.registerTask('default', ['build']);

    grunt.registerTask('patch', ['version::patch']);
    grunt.registerTask('minor', ['version::minor']);
    grunt.registerTask('major', ['version::major']);

    grunt.registerTask('dev', [
        'wiredep:dev'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy:dist',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'usemin',
        'htmlmin',
        'compress:build'
    ]);
};
