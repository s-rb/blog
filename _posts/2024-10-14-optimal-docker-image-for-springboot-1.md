---
title: 'The optimal Docker image for Spring Boot. Part 1'
layout: post
post-image: /assets/images/posts/2024/00007-0.png
description: The article outlines various methods for packaging a Spring Boot application into a Docker container, 
  highlighting best practices and practical implementation steps.
tags:
- springboot
- docker
- optimisation
- image
- post
---

This article discusses popular methods for packaging a Spring Boot application into a Docker container, 
emphasizing the importance of optimal packaging to avoid security vulnerabilities. It explores four specific 
approaches: a simple Dockerfile, building with the spring-boot-maven-plugin, using Google's Jib plugin, and writing 
an optimized Dockerfile. The article also provides practical steps for building and running the application, along 
with an analysis of the resulting Docker image.

---

<div class="Article-Text"><span><div>Let's consider popular ways to package an application into a container. We'll write our optimal Dockerfile for
    Spring Boot.
</div>
<div><br></div>
<div>We live in the era of microservices architecture, and containers have become the primary means of packaging and
    delivering applications to various environments. However, many developers do not pay enough attention to how to
    properly package a service, how to do it optimally, and most importantly, how not to leave security holes. In this
    article, we will explore 4 packaging methods:
</div>
<div><br></div>
<div>- Simple Dockerfile - build and get the image.</div>
<div>- Building with the spring-boot-maven-plugin.</div>
<div>- Using the special Jib plugin from Google.</div>
<div>- Writing an optimized Dockerfile.</div>
<br>
<div>For experiments, we will use the following project: github.com/Example-uPagge/spring_boot_docker. This is a Spring
    Boot application that contains a couple of simple controllers and repositories with an H2 database.
</div>
<h2>Simple Dockerfile</h2>
<div>A typical Dockerfile that developers write looks like this:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"><div>
FROM openjdk:17.0.2-jdk-slim-buster
</div>
<div>ARG JAR_FILE=target/*.jar</div>
<div>COPY ${JAR_FILE} app.jar</div>
<div>ENTRYPOINT ["java","-jar","/app.jar"]</div>
</pre>

<div><br></div>
<div>
    <img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00007-1.jpg">
    <br></div>
<div><br></div>
<div>Like a cake, a Docker image consists of a stack of layers. Each represents a change from the previous layer. When
    we pull a Docker image from the registry, it is pulled layer by layer and cached on the host.
</div>
<div><br></div>
<div>Our typical Docker image consists of a base layer with Linux - the thinner, the better. Then comes the JDK layer.
    And on top is the application layer, which is effectively just a jar file.
</div>
<div><br></div>
<div>Spring Boot uses the "Fat JAR" packaging format by default. This means that all dependencies required for execution
    are added to a single JAR file.
</div>
<div><br></div>
<div>But enough theory, let's move on to practice. To obtain the image, first build the application using Maven:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">mvn clean package</pre>
<div>Then build the image:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">docker build -t upagge/spring-boot-docker:dockerfile .</pre>
<div>In this case, 'upagge' is your DockerHub login, 'spring-boot-docker' is the image name, and 'dockerfile' is the
    tag. If you do not plan to push the image to DockerHub, you can specify the name without using the login. For
    example:
</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">docker build -t spring-boot-docker:0.0.1 .</pre>
<div>To analyze the image, use the dive utility. Dive allows you to show differences between layers: which files were
    added, changed, or removed.
</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">dive upagge/spring-boot-docker:dockerfile</pre>
<div><br></div>
<div>
    <img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00007-2.jpg"><br></div>
<div><br></div>
<div>The total size of the image is 448 MB, of which:</div>
<div><br></div>
<div>
    <img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00007-3.jpg"><br></div>
<div>
    <ul>
        <li>63+8.4 MB is the Linux layer.</li>
        <li>324 MB is the JDK size.</li>
        <li>53 MB is our spring-boot-jar.</li>
    </ul>
</div>
<div>Pay attention to the application layer size: 53 megabytes, even though the project contains almost no code. With
    any code change, we would have to send 53 megabytes over the network and the server would have to download 53
    megabytes. The other layers are unlikely to change, so Docker will not transmit them over the network and will use
    the cache. We'll figure out how to fix this shortly.
</div>
<div><br></div>
<div>To ensure everything works, run the image with the command:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">docker run -p 8080:8080 upagge/spring-boot-docker:0.0.1</pre>
<div>Open a browser and go to: http://localhost:8080/api/person/1. If the image was started successfully, you will see
    the word 'valid' in response.
</div>
<div><br></div><h3>Conclusions on Dockerfile</h3>
<div>This is how easily and simply we can package an application. However, this approach has several drawbacks that we
    will address shortly.
</div>
<div><br></div>
<div>Pros of this approach:</div>
<div>
    <ul>
        <li>Full control. You can build your image as you like.</li>
        <li>Fairly simple method.</li>
    </ul>
</div>
<div>Cons:</div>
<div>
    <ul>
        <li>Full control. You can break something or create a security hole.</li>
        <li>We haven't even started development, and the image is already heavy.</li>
        <li>A large volume of changing layers.</li>
        <li>Runs as root user.</li>
    </ul>
</div></span></div>