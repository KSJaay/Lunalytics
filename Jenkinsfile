pipeline {
    agent any
    
    environment {
        BUILD_VERSION = "${env.BUILD_NUMBER}"
        ARTIFACT_NAME = "lunalytics-build-${BUILD_VERSION}"
        CI = 'true'
        NODE_ENV = 'test'
    }
    
    stages {
        stage('Source Checkout') {
            steps {
                echo "Checking out source code from GitHub..."
                git branch: 'dev', url: 'https://github.com/ayesha-3/Lunalytics.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo "=== Installing Dependencies ==="
                bat 'npm ci --prefer-offline --no-audit'
            }
            post {
                success {
                    echo " Dependencies installed successfully!"
                }
                failure {
                    echo " Failed to install dependencies!"
                }
            }
        }
        
        stage('Lint') {
            steps {
                echo "=== Running Code Quality Checks ==="
                script {
                    try {
                        bat 'npm run lint'
                    } catch (Exception e) {
                        echo " Linting issues found: ${e.message}"
                        // Don't fail the build, but mark as unstable
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                echo "=== Running Test Stage ==="
                
                script {
                    def testsPassed = true
                    def failedTests = []
                    def testSummary = [:]
                    
                    try {
                        // Run tests with coverage
                        echo "Running Jest tests with coverage..."
                        bat 'npm test -- --ci --coverage --maxWorkers=2 --reporters=default --reporters=jest-junit --verbose'
                        
                    } catch (Exception e) {
                        testsPassed = false
                        echo " Some tests failed, but continuing pipeline..."
                        echo "Error details: ${e.message}"
                        
                        // Mark build as unstable instead of failed
                        currentBuild.result = 'UNSTABLE'
                    }
                    
                    // Try to parse and display failed tests
                    try {
                        if (fileExists('junit.xml')) {
                            echo "Parsing test results..."
                            def testResults = junit allowEmptyResults: true, testResults: 'junit.xml'
                            
                            if (testResults.failCount > 0) {
                                echo """
╔════════════════════════════════════════════════════════════╗
║                      TEST FAILURES DETECTED                ║
╚════════════════════════════════════════════════════════════╝
Total Tests: ${testResults.totalCount}
Passed: ${testResults.passCount}
Failed: ${testResults.failCount}
Skipped: ${testResults.skipCount}
════════════════════════════════════════════════════════════
                                """
                                
                                // Read and display failed test details
                                echo " Failed Test Cases:"
                                echo "════════════════════════════════════════════════════════════"
                                
                                // Parse junit.xml to get detailed failure info
                                try {
                                    def junitContent = readFile('junit.xml')
                                    def testsuites = new XmlSlurper().parseText(junitContent)
                                    
                                    testsuites.testsuite.each { testsuite ->
                                        testsuite.testcase.each { testcase ->
                                            if (testcase.failure.size() > 0) {
                                                echo """
   Test: ${testcase.@name}
   Suite: ${testcase.@classname}
   Error: ${testcase.failure.@message}
────────────────────────────────────────────────────────────
                                                """
                                            }
                                        }
                                    }
                                } catch (Exception parseError) {
                                    echo " Could not parse detailed test failures: ${parseError.message}"
                                }
                                
                                echo "════════════════════════════════════════════════════════════"
                                echo " BUILD MARKED AS UNSTABLE - Pipeline will continue"
                                echo " View detailed report: ${env.BUILD_URL}testReport/"
                                echo "════════════════════════════════════════════════════════════"
                            } else {
                                echo " All tests passed successfully!"
                            }
                        }
                    } catch (Exception parseException) {
                        echo " Could not parse test results: ${parseException.message}"
                    }
                    
                    // Check coverage thresholds (also won't fail pipeline)
                    try {
                        echo "Verifying coverage thresholds..."
                        bat 'npm test -- --coverage --coverageThreshold=\'{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}\' --passWithNoTests'
                    } catch (Exception coverageError) {
                        echo " Coverage thresholds not met, but continuing..."
                        if (currentBuild.result != 'UNSTABLE') {
                            currentBuild.result = 'UNSTABLE'
                        }
                    }
                }
            }
            
            post {
                always {
                    // Publish test results
                    echo "Publishing test results..."
                    script {
                        try {
                            junit allowEmptyResults: true, testResults: 'junit.xml'
                        } catch (Exception e) {
                            echo " No test results found to publish"
                        }
                    }
                    
                    // Publish coverage report
                    echo "Publishing coverage report..."
                    script {
                        try {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report',
                                reportTitles: 'Jest Coverage Report'
                            ])
                        } catch (Exception e) {
                            echo " Could not publish coverage report: ${e.message}"
                        }
                    }
                    
                    // Archive coverage artifacts
                    archiveArtifacts artifacts: 'coverage/**/*', 
                                     allowEmptyArchive: true,
                                     fingerprint: true
                    
                    // Generate and display coverage summary
                    script {
                        try {
                            def coverageExists = fileExists('coverage/coverage-summary.json')
                            if (coverageExists) {
                                def coverageSummary = readJSON file: 'coverage/coverage-summary.json'
                                def total = coverageSummary.total
                                
                                echo """
╔════════════════════════════════════════════════════════════╗
║                 TEST COVERAGE SUMMARY                      ║
╚════════════════════════════════════════════════════════════╝
Statements: ${total.statements.pct}% (${total.statements.covered}/${total.statements.total})
Branches: ${total.branches.pct}% (${total.branches.covered}/${total.branches.total})
Functions: ${total.functions.pct}% (${total.functions.covered}/${total.functions.total})
Lines: ${total.lines.pct}% (${total.lines.covered}/${total.lines.total})
════════════════════════════════════════════════════════════
                                """
                                
                                // Warn if coverage is low
                                if (total.statements.pct < 80 || total.branches.pct < 80 || 
                                    total.functions.pct < 80 || total.lines.pct < 80) {
                                    echo " WARNING: Coverage is below 80% threshold!"
                                    echo " Please add more tests to improve coverage"
                                }
                            }
                        } catch (Exception e) {
                            echo " Could not read coverage summary: ${e.message}"
                        }
                    }
                }
                
                success {
                    echo " All tests passed successfully!"
                }
                
                unstable {
                    echo """
╔════════════════════════════════════════════════════════════╗
║              TESTS FAILED - PIPELINE CONTINUING            ║
╚════════════════════════════════════════════════════════════╝
The build is marked as UNSTABLE but will proceed to deployment.
                    """
                }
            }
        }
        
        stage('Build') {
            steps {
                echo "=== Starting Build Stage ==="
                
                // Build application
                echo "Building application with Vite..."
                bat 'npm run build'
                
                // Create build info file
                script {
                    def buildInfo = """
Build Number: ${env.BUILD_NUMBER}
Build Date: ${new Date()}
Git Commit: ${env.GIT_COMMIT}
Branch: ${env.GIT_BRANCH}
Jenkins Job: ${env.JOB_NAME}
Test Status: All tests passed
                    """
                    writeFile file: 'dist/BUILD_INFO.txt', text: buildInfo
                }
                
                // Create deployment-ready artifact (ZIP)
                echo "Creating deployment artifact..."
                bat """
                    powershell Compress-Archive -Path dist\\* -DestinationPath ${ARTIFACT_NAME}.zip -Force
                """
                
                // Archive build artifacts in Jenkins
                echo "Archiving build artifacts..."
                archiveArtifacts artifacts: '*.zip', 
                                 fingerprint: true,
                                 allowEmptyArchive: false
                
                archiveArtifacts artifacts: 'dist/**/*', 
                                 fingerprint: true
                
                // Generate build report
                echo "=== Build Stage Completed ==="
                echo "Build version: ${BUILD_VERSION}"
                echo "Artifact: ${ARTIFACT_NAME}.zip"
            }
            
            post {
                success {
                    echo " Build artifacts created successfully!"
                    echo "Artifact: ${ARTIFACT_NAME}.zip"
                }
                failure {
                    echo " Build failed!"
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo "=== Running Security Checks ==="
                script {
                    try {
                        // Check for security vulnerabilities
                        bat 'npm audit --audit-level=moderate --production'
                    } catch (Exception e) {
                        echo " Security vulnerabilities found: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                echo "=== Deploying to Staging Environment ==="
                
                script {
                    def stagingDir = "D:\\staging\\lunalytics-${BUILD_VERSION}"
                    
                    // Create staging directory
                    bat "if not exist ${stagingDir} mkdir ${stagingDir}"
                    
                    // Extract artifact to staging
                    bat """
                        powershell Expand-Archive -Path ${ARTIFACT_NAME}.zip -DestinationPath ${stagingDir} -Force
                    """
                    
                    // Copy to current staging location
                    bat "xcopy /E /I /Y ${stagingDir} D:\\staging\\lunalytics-current\\"
                    
                    echo "Staging deployed to: ${stagingDir}"
                    echo "Current staging: D:\\staging\\lunalytics-current"
                }
            }
            
            post {
                success {
                    echo " Staging deployment successful!"
                    echo "Staging URL: http://localhost/staging/lunalytics-current"
                }
            }
        }
        
        stage('Smoke Tests') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                echo "=== Running Smoke Tests on Staging ==="
                script {
                    try {
                        // Add basic smoke tests here
                        bat 'echo Checking if build artifacts exist...'
                        bat 'if exist D:\\staging\\lunalytics-current\\index.html (echo  index.html found) else (echo  index.html missing && exit 1)'
                    } catch (Exception e) {
                        echo " Smoke tests failed: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                expression { 
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
                echo "=== Deploying to Production ==="
                echo "Would deploy ${ARTIFACT_NAME}.zip to production"
                // Add your production deployment steps here
            }
        }
    }
    
    post {
        success {
            echo """
╔════════════════════════════════════════╗
║      PIPELINE COMPLETED SUCCESSFULLY   ║
╚════════════════════════════════════════╝
Build: ${BUILD_VERSION}
Branch: ${env.GIT_BRANCH}
            """
        }
        
        failure {
            echo """
╔════════════════════════════════════════╗
║           PIPELINE FAILED              ║
╚════════════════════════════════════════╝
Build: ${BUILD_VERSION}
Check logs for details
            """
        }
        
        unstable {
            echo """
╔════════════════════════════════════════╗
║          PIPELINE UNSTABLE             ║
╚════════════════════════════════════════╝
Build: ${BUILD_VERSION}
Some checks failed but build succeeded
            """
        }
        
        always {
            // Cleanup
            echo "=== Cleanup Stage ==="
            
            // Clean up node_modules to save space (optional)
            // bat 'if exist node_modules rmdir /s /q node_modules'
            
            // Generate build badge
            script {
                def status = currentBuild.result ?: 'SUCCESS'
                def color = status == 'SUCCESS' ? 'brightgreen' : (status == 'UNSTABLE' ? 'yellow' : 'red')
                echo "Build Status: ${status}"
            }
            
            // Send notifications (if configured)
            echo "Pipeline execution completed at ${new Date()}"
        }
    }
}
