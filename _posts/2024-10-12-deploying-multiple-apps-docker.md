---
title: 'Deploying Multiple Apps on a Single VPS'
layout: post
post-image: /assets/images/posts/2024/00003-1.png
description: Docker enables the efficient deployment and management of multiple applications on a single VPS through 
  containerization, simplifying updates and service management with tools like Portainer.
tags:
- docker
- post
- vps
- portainer
---

Deploying multiple applications on a single VPS using Docker allows for efficient isolation and management of each app 
in containers. By installing Docker and creating a docker-compose.yml file, you can easily launch and manage services 
like Node.js and PHP. Additionally, tools like Portainer provide a user-friendly web interface for streamlined 
container management, making updates and oversight simpler.

---

<b>Deploying Multiple Apps on a Single VPS with Docker</b>

Docker enables efficient deployment of multiple applications on a single VPS by isolating them in containers. This simplifies management and updates.

<b>Step 1: Install Docker</b>

Install Docker on your server. For Ubuntu, use the following commands:

<pre><code>sudo apt update
sudo apt install docker.io</code></pre>

Start Docker:

<pre><code>sudo systemctl start docker
sudo systemctl enable docker</code></pre>

<b>Step 2: Using Docker Compose</b>

Create a <code>docker-compose.yml</code> file to manage your containers. Here's an example with two apps (Node.js and PHP):

<pre><code>version: '3'
services:
  node-app:
    image: node:14
    ports:
      - "3000:3000"
  php-app:
    image: php:7.4-apache
    ports:
      - "8080:80"</code></pre>

Launch the services:

<pre><code>docker-compose up -d</code></pre>

<b>Step 3: Manage via Portainer</b>

To simplify container management, use <a href="https://www.portainer.io/">Portainer</a>, a web-based UI for managing Docker containers. To install it:

<pre><code>docker run -d -p 9000:9000 --name=portainer \
--restart=always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v portainer_data:/data portainer/portainer-ce</code></pre>

Once installed, Portainer will be available on port <code>9000</code>.

<b>Conclusion</b>

Using Docker and tools like Portainer allows you to deploy and manage multiple applications on a single VPS easily, simplifying service management and updates.