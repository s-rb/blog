---
title: 'Deploying Keycloak on a VPS Using Docker-compose, Nginx, Certbot, and SSL'
layout: post
post-image: /assets/images/posts/2024/00012-0.jpeg
description: This article provides a step-by-step guide for deploying Keycloak on a VPS with Docker-compose, Nginx, 
  Certbot, and SSL for secure access and automated deployment.
tags:
  - keycloak
  - docker
  - ssl
  - certbot
  - vps
  - nginx

---

The article explains how to deploy Keycloak, an open-source identity management system, on a VPS using Docker-compose, 
Nginx, Certbot, and SSL for secure access. It covers essential setup steps, including creating a domain, configuring 
Nginx, setting up SSL certificates, and using Docker for deployment automation. The guide also details how to handle 
automatic certificate renewal and import Keycloak realms during startup.

---

<div class="Article-Text"><span><div>Hello everyone!</div>
<div><br></div>
<div>In this article, I would like to share how to deploy Keycloak on a VPS using Docker-compose, Nginx, Certbot, and
    SSL.
</div>
<div><br></div><h2>Key Points:</h2>
<div>- Keycloak v.25.0.1</div>
<div>- SSL protection for Keycloak</div>
<div>- Certbot v.2.11.0 for obtaining and renewing SSL certificates</div>
<div>- Nginx v.1.27.0 as a reverse proxy</div>
<div>- Postgres v.14 to replace the default internal H2 DB of Keycloak</div>
<div>- Automatic realm import during deployment</div>
<div>- Docker-compose for deployment automation</div>
<div>- .env file for managing environment variables</div>
<div><br></div>
<div>For those who might not be familiar, Keycloak is a powerful access management system with SSO support that can
    significantly simplify user management and authentication.
</div>
<div><br></div>
<div>The desire to deploy your own Keycloak can arise both for experimenting with your projects and for handling your
    usual backend tasks. This happened to me as well. I decided to kill two birds with one stone. However, I couldn't
    find a comprehensive guide. I don't need Keycloak locally, but setting it up on a separate, always-available server
    with backup and the ability to export/import realms, etc., is excellent. Plus, the deployment process is automated,
    making it easier to switch to another VPS provider.
</div>
<div><br></div>
<div>Everyone has their own motivation, but let's get to the point.</div>
<div><br></div>
<h2>Introduction</h2>
<br>
<h4>What is Keycloak?</h4>
<div>Keycloak is an open-source identity and access management solution. It provides features such as SSO (Single
    Sign-On), user management, authentication, and authorization.
</div>
<br>
<h4>Why Docker-compose?</h4>
<div>Docker-compose makes it easy to manage multi-component applications like Keycloak and simplifies the deployment and
    scaling process. This guide uses containers for Keycloak, Certbot, Nginx, and the Postgres database.
</div>
<br>
<h4>Why Nginx and Certbot?</h4>
<div>Nginx will act as a reverse proxy, ensuring security and performance, while Certbot will help obtain and
    automatically renew SSL certificates from Let's Encrypt, saving us a couple of thousand rubles on certificates for
    our domain, which is nice.
</div>
<div><br></div>
<div>Let's get started!</div>
<div><br></div><h2>Step 1: Preparing the Environment</h2><h4>Cloning the Repository</h4>
<div>First, clone the repository with ready-made configurations to our VPS, which I have carefully prepared for you. It
    contains docker-compose.yml for managing deployment, nginx configs, and an environment variables file needed for
    docker-compose.
</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">    git clone git@github.com:s-rb/keycloak-dockerized-ssl-nginx.git
    cd keycloak-dockerized-ssl-nginx</pre>
<h4>Editing the .env File</h4>
<div>Open the .env file and edit the following variables:</div>
<div><br></div>
<div>- <span style="font-weight: bold;">KEYCLOAK_ADMIN_PASSWORD</span> - Admin password for accessing Keycloak</div>
<div>- <span style="font-weight: bold;">KC_DB_PASSWORD</span> - Password for Keycloak service access to the Postgres DB
    (should match `POSTGRES_PASSWORD` if a
    separate user is not created)
</div>
<div>- <span style="font-weight: bold;">POSTGRES_PASSWORD</span> - Admin password for Postgres</div>
<div><br></div>
<div>Replace `password` with your values unless you want anyone to connect to your services ;)</div>
<div><br></div>
<div>Example of a complete environment variables file:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">    KEYCLOAK_ADMIN=admin
    KEYCLOAK_ADMIN_PASSWORD=password
    PROXY_ADDRESS_FORWARDING=true
    KC_PROXY=edge
    <br>
    KC_DB=postgres
    KC_DB_URL=jdbc:postgresql://keycloak-postgres:5432/keycloak
    KC_DB_USERNAME=keycloak
    KC_DB_PASSWORD=password
    POSTGRES_DB=keycloak
    POSTGRES_USER=keycloak
    POSTGRES_PASSWORD=password
</pre>
<div><br></div><h2>Step 2: Domain Registration and DNS Setup</h2>
<div>This step can be done before the first step - it does not depend on it. In the following instructions, we assume
    you have registered your domain (e.g., surkoff.com) and we want Keycloak to be accessible at
    my-keycloak.surkoff.com.
</div>
<div><br></div><h4>Domain Registration</h4>
<div>Register a domain with any registrar, for example, REG.RU.</div>
<div><br></div><h4>Creating an A Record for the Subdomain</h4>
<div>Create an A record pointing to your server's IP. For example, for the subdomain my-keycloak.surkoff.com, specify
    your server's IP.
</div>
<div><br></div>
<div><img style="height: auto; display: block; margin: auto; max-width: 400px;" src="https://blog.surkoff.com/images/upload/154/642/3137/7B48E32F52CFD5C1EB1CC54C926D363A.jpg"><br></div>
<div><br></div><h4>Checking the DNS Record</h4>
<div>Ensure the DNS record is correctly configured:</div>
<div><br></div>
<div>
    <pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">ping my-keycloak.surkoff.com</pre>
</div>
<div><br></div>
<div>The response should show your server's IP address.</div>
<div><br></div><h2>Step 3: Configuring Nginx</h2><h4>Nginx Configuration</h4>
<div>In the nginx configs - `<span style="font-weight: bold;">default.conf_with_ssl</span>`, `<span style="font-weight: bold;">default.conf_without_ssl</span>` specify your domain:
</div>
<div><br></div>
<div>- In the `<span style="font-weight: bold;">server_name</span>` section</div>
<div>- In the path to the certificate `<span style="font-weight: bold;">ssl_certificate</span>`</div>
<div>- In the path to the key `<span style="font-weight: bold;">ssl_certificate_key</span>`</div>
<div><br></div>
<div>Example configuration with SSL:</div>
<div>
    <div><pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">server {
    listen 443 ssl;
    server_name my-keycloak.surkoff.com;

    ssl_certificate /etc/letsencrypt/live/my-keycloak.surkoff.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/my-keycloak.surkoff.com/privkey.pem;

    location / {
        proxy_pass http://keycloak:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}</pre>
</div>
<div><br></div>
</div>
<h2>Step 4: Obtaining an SSL Certificate</h2>
<h4>Obtaining a Test Certificate</h4>
<div>Use the configuration without SSL:</div>
<div>
    <div><pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; line-height: 18px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto;"><span style="color: rgb(64, 64, 64); font-family: Consolas, Monaco, Monospaced, monospace; font-size: 12px;">cp nginx/conf.d/default.conf_without_ssl nginx/conf.d/default.conf
docker-compose up -d</span></pre>
    </div>
    <div><br></div>
    <div>Obtain a test certificate (replace the domain and email with your own):</div>
</div>
<div>
    <pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; line-height: 18px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto;"><span style="color: rgb(64, 64, 64); font-family: Consolas, Monaco, Monospaced, monospace; font-size: 12px;">docker exec certbot certbot certonly --webroot --webroot-path=/data/letsencrypt -d my-keycloak.surkoff.com --email your_email@gmail.com --agree-tos --no-eff-email --staging</span></pre>
</div><h4><img style="height: auto; display: block; margin: auto; max-width: 750px;" src="https://blog.surkoff.com/images/upload/-20/797/64064/784819F1E978B245B694B7749D3F054D.jpg"><br></h4>
<h4>Checking the Certificate</h4>
<div>
    <pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; line-height: 18px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto;"><span style="color: rgb(64, 64, 64); font-family: Consolas, Monaco, Monospaced, monospace; font-size: 12px;">docker exec certbot certbot certificates</span></pre>
</div>
<br>
<h4>Deleting the Test Certificate (replace the domain with your own)</h4>
<div>
    <pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; line-height: 18px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto;"><span style="color: rgb(64, 64, 64); font-family: Consolas, Monaco, Monospaced, monospace; font-size: 12px;">docker exec certbot certbot delete --cert-name my-keycloak.surkoff.com</span></pre>
</div>
<br>
<h4>Obtaining a Real Certificate (replace email and domain with your own)</h4>
<div>
    <pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; line-height: 18px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto;"><span style="color: rgb(64, 64, 64); font-family: Consolas, Monaco, Monospaced, monospace; font-size: 12px;">docker exec certbot certbot certonly --webroot --webroot-path=/data/letsencrypt -d my-keycloak.surkoff.com --email your_email@gmail.com --agree-tos --no-eff-email</span></pre>
</div>
<br>
<h2>Step 5: Final Configuration and Launch</h2><h4>Updating Nginx Configuration to Use SSL</h4>
<div><pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; line-height: 18px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto;"><span style="color: rgb(64, 64, 64); font-family: Consolas, Monaco, Monospaced, monospace; font-size: 12px;">docker-compose down
cp nginx/conf.d/default.conf_with_ssl nginx/conf.d/default.conf
docker-compose up -d</span></pre>
</div>
<br>
<h4>Checking Access to Keycloak</h4>
<div>Open a browser and go to my-keycloak.surkoff.com (your domain).</div>
<div><br></div>
<div>You should see the admin login page where you can log in using the username and password you specified in the .env
    file.
</div>
<div><br></div>
<div><img style="height: auto; display: block; margin: auto; max-width: 750px;" src="https://blog.surkoff.com/images/upload/-74/563/0311/DF270E9D92F17ACD5F10830A80BAC89E.jpg"><br></div>
<div><br></div>
<div>For configuring Keycloak, there are interesting articles on other resources, which we won't cover in this
    publication.
</div>
<div><br></div><h4>Automatic Certificate Renewal</h4>
<div>To automatically renew certificates and restart Nginx, create the `renew_and_reload.sh` script (already available
    in the repository):
</div>
<div>
    <div><pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; line-height: 18px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto;"><span style="color: rgb(64, 64, 64); font-family: Consolas, Monaco, Monospaced, monospace; font-size: 12px;">#!/bin/bash
# Renew certificates
docker exec certbot certbot renew --webroot --webroot-path=/data/letsencrypt

# Restart Nginx
docker restart nginx</span></pre>
</div>
</div>
<div><br></div>
<div>Make the script executable:</div>
<div>
    <div>
        <pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; line-height: 18px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto;"><span style="color: rgb(64, 64, 64); font-family: Consolas, Monaco, Monospaced, monospace; font-size: 12px;">chmod +x renew_and_reload.sh</span></pre>
    </div>
</div>
<div><br></div>
<div>Add it to crontab for regular execution:</div>
<div>
    <div>
        <pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; line-height: 18px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto;"><span style="color: rgb(64, 64, 64); font-family: Consolas, Monaco, Monospaced, monospace; font-size: 12px;">crontab -e</span></pre>
    </div>
</div>
<div><br></div>
<div>Add a line to crontab, remembering to specify the path to the script:</div>
<div>
    <pre style="margin-top: 5px; margin-bottom: 5px; padding: 5px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; line-height: 18px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; max-width: 100%; overflow: auto;"><span style="color: rgb(64, 64, 64); font-family: Consolas, Monaco, Monospaced, monospace; font-size: 12px;">0 0 1 * * /path/to/renew_and_reload.sh</span></pre>
</div>
<br>
<h2>Importing Realms</h2>
<div>If you want to import a realm at startup, you can place it in the `<span style="font-weight: bold;">keycloak/config/</span>`
    folder, and it
    will be imported when the application starts.
</div>
<div><br></div>
<h2>Conclusion</h2>
<div>That's it! Now you have a deployed latest&nbsp;<span style="font-weight: bold;">Keycloak</span> with <span style="font-weight: bold;">SSL</span> on your <span style="font-weight: bold;">VPS</span>. I hope this article
    was helpful! If you have any
    questions or suggestions, feel free to write to me in private messages.
</div>
<div><br></div>
<div>The source code is available at the link - <a href="https://github.com/s-rb/keycloak-dockerized-ssl-nginx">https://github.com/s-rb/keycloak-dockerized-ssl-nginx</a>.
</div></span></div>