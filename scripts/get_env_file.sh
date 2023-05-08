#!/bin/bash

# Get the value of the parameter from AWS SSM Parameter Store
ENV_VAR_VALUE=$(aws ssm get-parameters --region us-west-2 --names pras-ecs-nodejs-helloworld --query 'Parameter.Value' --output text)

# Write the parameter value to the .env file
echo "$ENV_VAR_VALUE" > /usr/src/app/.env