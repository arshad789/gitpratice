def imageTag = '1.0.' + env.BUILD_NUMBER
def registry = 'arshad789/dynamic_collection'
def dockerImage = ''

pipeline {
	agent {
		label 'eims'
	}

    stages {

        stage ('Build Nodejs microservice') {
		    when {
                expression {
                    return env.BRANCH_NAME.equals("master") || env.BRANCH_NAME.equals("development")
                }
            }
			steps {
				 script {
                    sh 'yarn install --production'
                }
			}
		}

		stage ('Build, push and then remove Docker image') {
		    when {
                expression {
                    return env.BRANCH_NAME.equals("master") || env.BRANCH_NAME.equals("development")

                }
            }
			steps {
				 script {
                    dockerImage = docker.build registry + ":$imageTag"
                    dockerImage.push()
                    // sh "docker rmi ${registry}:${imageTag}"

                }
			}
		}
        stage ('Deploy to Kubernetes') {
		    when {
                expression {
                    return env.BRANCH_NAME.equals("feature/v2") || env.BRANCH_NAME.equals("development")

                }
            }
			steps {
				 sh "sed -i -e 's#VERSION#${imageTag}#g' dynamic-collections-all-in-one.yaml"
                 sh "kubectl apply -f dynamic-collections-all-in-one.yaml"

			}
		}
		}

       }

	
    
	//post {
    //    always {
    //        junit 'target/surefire-reports/**/*.xml'
    //        deleteDir() /* clean up our workspace */
    //    }
    //}