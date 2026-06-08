# HCHI Deployable Application Standard

## Purpose

This document defines the required project structure and deployment standards for applications deployed into the Hybrid Cloud HomeLab Infrastructure (HCHI) platform.

Every application must follow this structure so the automated deployment engine can:

* Build Docker images
* Deploy containers automatically
* Configure networking
* Register applications
* Support intelligent routing
* Enable monitoring and rollback systems

---

# Standard Application Structure

```text
app-name/
├── Dockerfile
├── deployment.json
├── .dockerignore
├── README.md
├── src/
├── public/
├── package.json
└── application source files
```

---

# Required Files

| File               | Required | Purpose                                 |
| ------------------ | -------- | --------------------------------------- |
| Dockerfile         | YES      | Defines container build process         |
| deployment.json    | YES      | Deployment metadata for platform engine |
| .dockerignore      | YES      | Optimizes Docker image builds           |
| README.md          | YES      | Application documentation               |
| package.json       | Optional | Node.js dependency management           |
| docker-compose.yml | Optional | Local development only                  |

---

# 1. Dockerfile

The Dockerfile defines how the application is containerized.

## Static Website Example

```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 80
```

---

## Node.js Example

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

---

# 2. deployment.json

This file is REQUIRED.

The HCHI deployment engine reads this file to automatically configure infrastructure.

## Standard Format

```json
{
  "app_name": "dashboard",
  "container_name": "dashboard-app",
  "internal_domain": "dashboard.homelab",
  "container_port": 80,
  "host_port": 3000,
  "health_endpoint": "/",
  "restart_policy": "unless-stopped",
  "network": "homelab-network"
}
```

---

# deployment.json Field Definitions

| Field           | Description                |
| --------------- | -------------------------- |
| app_name        | Logical application name   |
| container_name  | Docker container name      |
| internal_domain | Internal routing hostname  |
| container_port  | Port inside container      |
| host_port       | Exposed Raspberry Pi port  |
| health_endpoint | Health monitoring endpoint |
| restart_policy  | Docker restart policy      |
| network         | Docker network for routing |

---

# 3. .dockerignore

Prevents unnecessary files from entering Docker image builds.

## Recommended Template

```text
node_modules
.git
.github
README.md
.env
Dockerfile.old
```

---

# Docker Networking Requirement

All applications MUST connect to:

```text
homelab-network
```

This enables:

* NGINX Proxy Manager routing
* Internal service discovery
* Multi-application communication
* Intelligent routing infrastructure

---

# Internal Routing Standard

Applications should be accessible through:

```text
app-name.homelab
```

Examples:

```text
dashboard.homelab
portfolio.homelab
api.homelab
analytics.homelab
```

---

# Deployment Workflow

```text
Developer Laptop
        ↓
Git Push
        ↓
GitHub Repository
        ↓
Self-Hosted GitHub Runner
        ↓
HCHI Deployment Engine
        ↓
Docker Build & Deployment
        ↓
NGINX Internal Routing
```

---

# Local Development Guidelines

Applications should:

* Run locally before deployment
* Build successfully using Docker
* Expose correct ports
* Avoid hardcoded IP addresses
* Support environment variables when needed

---

# Recommended Docker Practices

## Use lightweight images

Preferred:

* nginx:alpine
* node:alpine

---

## Use restart policies

Recommended:

```json
"restart_policy": "unless-stopped"
```

---

## Avoid privileged containers

Do not use:

* privileged mode
* host networking
* unnecessary capabilities

unless absolutely required.

---

# CI/CD Compatibility Requirements

Applications should:

* Build without manual interaction
* Start automatically
* Support automated redeployment
* Avoid interactive prompts
* Support reproducible builds

---

# Future HCHI Platform Features

Applications deployed using this standard will support:

* Automated deployment
* Multi-app hosting
* Intelligent internal routing
* Internal DNS
* Monitoring & observability
* Deployment dashboard
* Rollback system
* Health checks
* Automatic recovery

---

# HCHI Platform Philosophy

The goal of this platform is to create:

* Self-hosted infrastructure
* Private CI/CD systems
* Intelligent internal routing
* Dockerized hosting infrastructure
* Platform engineering workflows
* Enterprise-style homelab architecture

---

# Final Notes

All applications deployed into HCHI should be:

* Portable
* Dockerized
* Automated
* Reproducible
* Scalable
* Observable

Following this standard ensures the platform remains maintainable and extensible as the infrastructure grows.
