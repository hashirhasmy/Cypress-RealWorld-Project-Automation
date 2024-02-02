pipeline {
    agent {
        kubernetes {
            containerTemplates([
                containerTemplate(name : 'nodejs', image: 'node:alpine3.17', args: '99d', command: 'sleep'),
                containerTemplate(name : "cypress", image: "cypress/included", ttyEnabled: true, args: '99d', command: 'sleep')
            ])
        }
    } 
    environment {
        CI = 'false'

    }
    stages {
        stage('install') {
            steps {
              cache(maxCacheSize: 2000, caches: [
                        arbitraryFileCache(path: 'node_modules', cacheValidityDecidingFile: 'yarn.lock')
                ]) {
                    container('nodejs') {
                        sh "yarn install --network-timeout 1000000"
                    }
                }
            }         
        }
        stage('test') {
            steps {
                ansiColor('xterm') {
                    container('cypress') {
                        script {
                            sh "./node_modules/.bin/cypress install"
                            sh "yarn cypress:run"
                        }
                    }    
                }
            }         
        }
    }
}