# CI/CD + Security + Provenance Workflow

This repository includes a comprehensive, production-grade CI/CD workflow that provides automated testing, security scanning, supply chain provenance, and deployment to AWS ECS.

## Overview

The workflow is defined in `.github/workflows/main.yml` and provides:

- **Core CI Pipeline**: Lint, test, and build with Node 20 + dependency caching
- **Security Scanning**: 
  - ESLint with SARIF output uploaded to GitHub Code Scanning
  - CodeQL analysis for JavaScript/TypeScript (security + quality queries)
  - DevSkim lightweight SAST scanning
- **Supply Chain Security**: SLSA v3 provenance for built artifacts
- **AWS Deployment**: 
  - OIDC-based authentication (no long-lived access keys)
  - Docker image build and push to Amazon ECR
  - Deployment to Amazon ECS with Fargate
- **Optional Publishing**: Automated npm package publishing on release tags

## Workflow Triggers

The workflow runs on:
- **Push to `main` branch**: Runs full CI + deploys to ECS
- **Pull requests to `main`**: Runs CI + security scans (no deployment)
- **Tags matching `v*.*.*`**: Runs full CI + security + deploys + publishes to npm

## Required Secrets

### Required for ECS Deployment

1. **`AWS_ROLE_TO_ASSUME`** (Repository or Environment secret)
   - IAM role ARN for OIDC authentication
   - Must have permissions for:
     - ECR: `ecr:GetAuthorizationToken`, `ecr:BatchCheckLayerAvailability`, `ecr:PutImage`, `ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`, `ecr:CompleteLayerUpload`
     - ECS: `ecs:RegisterTaskDefinition`, `ecs:UpdateService`, `ecs:DescribeServices`
     - IAM: `iam:PassRole` (for task execution role)

### Optional for npm Publishing

2. **`NPM_TOKEN`** (Repository secret, only needed if publishing)
   - NPM access token with publish permissions
   - Only required if you plan to publish packages on release tags

## AWS Infrastructure Setup

### 1. Configure OIDC Identity Provider in AWS

```bash
# Add GitHub as an OIDC provider in your AWS account
# Provider URL: https://token.actions.githubusercontent.com
# Audience: sts.amazonaws.com
```

### 2. Create IAM Role for GitHub Actions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:brandonlacoste9-tech/adgenxai:*"
        }
      }
    }
  ]
}
```

### 3. Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name adgenxai/app \
  --region us-east-1
```

### 4. Create ECS Cluster

```bash
aws ecs create-cluster \
  --cluster-name adgenxai-cluster \
  --region us-east-1
```

### 5. Create CloudWatch Log Group

```bash
aws logs create-log-group \
  --log-group-name /ecs/adgenxai \
  --region us-east-1
```

### 6. Update Task Definition

Edit `.github/ecs/task-definition.json` and replace:
- `ACCOUNT_ID` with your AWS account ID
- Adjust CPU/memory if needed
- Add any environment variables or secrets

### 7. Create ECS Service

```bash
aws ecs create-service \
  --cluster adgenxai-cluster \
  --service-name adgenxai-service \
  --task-definition adgenxai-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --region us-east-1
```

## Customization

### Environment Variables

You can customize deployment targets by modifying these environment variables in the workflow:

```yaml
env:
  NODE_VERSION: '20'           # Node.js version
  AWS_REGION: us-east-1        # AWS region
  ECR_REPOSITORY: adgenxai/app # ECR repository name
  CONTAINER_NAME: adgenxai     # Container name in task definition
  ECS_CLUSTER: adgenxai-cluster # ECS cluster name
  ECS_SERVICE: adgenxai-service # ECS service name
```

### Using GitHub Environments

For environment-specific configuration, create GitHub environments (e.g., `production`, `staging`) and scope secrets to those environments:

1. Go to Settings → Environments
2. Create environment (e.g., `production`)
3. Add environment-specific secrets
4. Update workflow to use the environment:

```yaml
publish-npm:
  environment: production  # This job uses the production environment
```

## Workflow Jobs

### 1. CI Job
- Checks out code
- Sets up Node.js 20 with npm caching
- Installs dependencies
- Runs linting (if configured)
- Generates ESLint SARIF report
- Runs tests
- Builds the application
- Uploads build artifacts

### 2. CodeQL Job
- Runs after CI completes
- Performs security and quality analysis on JavaScript/TypeScript
- Uploads results to GitHub Security tab

### 3. DevSkim Job
- Runs after CI completes
- Performs lightweight security scanning
- Uploads SARIF results to GitHub Code Scanning

### 4. SLSA Provenance Job
- Runs after CI completes
- Generates SLSA v3 provenance attestation
- Links build artifacts to source commit
- Uploads provenance as release asset

### 5. Publish NPM Job
- Only runs on release tags (`v*.*.*`)
- Requires `codeql` job to complete
- Publishes package to npm with provenance

### 6. Deploy ECS Job
- Only runs on `main` branch or release tags
- Requires `ci` and `codeql` jobs to complete
- Authenticates to AWS via OIDC
- Builds Docker image
- Pushes image to ECR
- Updates ECS task definition
- Deploys to ECS service

## Security Features

### OIDC Authentication
- No long-lived AWS access keys stored in GitHub
- Uses OpenID Connect for secure, temporary credentials
- Scoped to specific repository and branches

### Code Scanning
- Multiple security tools (ESLint, CodeQL, DevSkim)
- Results visible in GitHub Security tab
- Automatic PR comments for new issues

### Supply Chain Security
- SLSA v3 provenance generation
- Npm publish with provenance enabled
- Artifact attestation for traceability

### Container Security
- Multi-stage Docker build
- Minimal nginx-alpine base image
- Security headers configured
- Health checks enabled
- Non-root user (nginx runs as nginx user)

## Concurrency Control

The workflow uses concurrency groups to prevent duplicate runs:
- Only one workflow runs per branch/ref at a time
- In-progress runs are cancelled when new commits are pushed
- Optimized for stacked PR workflows

## Troubleshooting

### Build Failures
- Check that all dependencies are correctly listed in `package.json`
- Ensure the build script is properly configured
- Review build logs in the GitHub Actions tab

### Test Failures
- Pre-existing test failures are not your responsibility to fix
- Only fix tests related to your changes
- Check test logs for specific error messages

### Deployment Failures
- Verify AWS credentials and IAM role permissions
- Check that ECR repository exists
- Ensure ECS cluster and service are created
- Review CloudWatch logs for container errors

### SARIF Upload Failures
- Ensure the `security-events: write` permission is granted
- Check that SARIF files are valid JSON
- Verify the files exist before upload

## Benefits

- **Fast Feedback**: Parallel job execution for quick CI results
- **Security First**: Multiple scanning tools catch issues early
- **No Secrets**: OIDC eliminates need for AWS access keys
- **Audit Trail**: SLSA provenance provides build traceability
- **Production Ready**: Battle-tested actions and best practices
- **Stacked PR Friendly**: Concurrency control prevents conflicts

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS ECS Deployment](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
- [SLSA Framework](https://slsa.dev/)
- [CodeQL](https://codeql.github.com/)
- [OIDC with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
