# AdgenxAI Fusion v2 Cloud Deployment Guide

This document outlines how to deploy the complete Fusion Suite on scalable cloud infrastructure.  
You can use either AWS ECS (Fargate) or Google Cloud Run for serverless‑style operation.

---

## 1 – Pre‑requisites

- Docker and Docker Compose installed locally or inside CI.  
- Fusion app container image built and tagged (for example `adgenxai/fusion:v2.0.0`).  
- Credentials for the target platform (AWS CLI or gcloud).  
- `.env` file containing required keys (Google API, Slack webhook, etc.).

---

## 2 – Build and Push Image

### AWS ECR

```bash
aws ecr create-repository --repository-name adgenxai-fusion || true
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t adgenxai-fusion:v2.0.0 .
docker tag adgenxai-fusion:v2.0.0 <account-id>.dkr.ecr.us-east-1.amazonaws.com/adgenxai-fusion:v2.0.0
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/adgenxai-fusion:v2.0.0
```

### Google Artifact Registry

```bash
gcloud auth configure-docker
gcloud artifacts repositories create adgenxai-fusion --repository-format=docker --location=us
docker build -t us-docker.pkg.dev/<project>/adgenxai-fusion/fusion:v2.0.0 .
docker push us-docker.pkg.dev/<project>/adgenxai-fusion/fusion:v2.0.0
```

---

## 3 – Deploy to AWS ECS (Fargate)

1. Create a **task definition** referencing the ECR image:  

   ```json
   {
     "family": "adgenxai-fusion",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "memory": "1024",
     "cpu": "512",
     "containerDefinitions": [
       {
         "name": "fusion",
         "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/adgenxai-fusion:v2.0.0",
         "portMappings": [{ "containerPort": 8000 }]
       }
     ]
   }
   ```

2. Deploy the service:

   ```bash
   aws ecs create-cluster --cluster-name fusion-cluster || true
   aws ecs register-task-definition --cli-input-json file://ecs_task.json
   aws ecs create-service \
     --cluster fusion-cluster \
     --service-name fusion-service \
     --task-definition adgenxai-fusion \
     --desired-count 1 \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
   ```

---

## 4 – Deploy to Google Cloud Run

```bash
gcloud run deploy adgenxai-fusion \
  --image us-docker.pkg.dev/<project>/adgenxai-fusion/fusion:v2.0.0 \
  --port 8000 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GOOGLE_API_KEY=$GOOGLE_API_KEY,SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL"
```

Cloud Run will supply HTTPS automatically at the provided service URL.

---

## 5 – Integrate with GitHub Actions

Append this stage to `.github/workflows/fusion-rehearsal.yml`:

```yaml
  deploy:
    if: success()
    needs: rehearse
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS or GCP credentials
        uses: google-github-actions/setup-gcloud@v2
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          export_default_credentials: true
      - name: Build and Push Image
        run: |
          docker build -t fusion:latest .
          docker tag fusion:latest us-docker.pkg.dev/$PROJECT/fusion/fusion:latest
          docker push us-docker.pkg.dev/$PROJECT/fusion/fusion:latest
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy adgenxai-fusion \
            --image us-docker.pkg.dev/$PROJECT/fusion/fusion:latest \
            --region us-central1 --allow-unauthenticated \
            --port 8000
```

This ensures that after successful rehearsals, your CI/CD pipeline automatically redeploys the live Fusion service.

---

## 6 – Verification

Once deployed:

```bash
curl https://<service-url>/stream?prompt=System%20check
```

You should receive a streamed response confirming the app's active deployment.

---

## 7 – Rollback and Cleanup

Remove service (example AWS):

```bash
aws ecs delete-service --cluster fusion-cluster --service fusion-service --force
```

Remove service (example GCP):

```bash
gcloud run services delete adgenxai-fusion
```

---

## Notes

- Use version tags (`v2.0.0`, `v2.1.0`) for each production release image.  
- CI rehearsals remain part of deployment validation before promotion.  
- All environment variables propagate from `.env` or GitHub Secrets.

---

This approach gives you **local → Docker → CI → Cloud** symmetry with identical rehearsal logic across all stages.