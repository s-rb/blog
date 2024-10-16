---
title: 'The optimal Docker image for Spring Boot. Part 2'
layout: post
post-image: /assets/images/posts/2024/00008-0.jpg
description: The article covers using the spring-boot-maven-plugin to package Spring Boot applications into optimized 
  Docker images with improved caching and no need for a Dockerfile.
tags:
- springboot
- docker
- optimization
- image
- post
---

This article discusses the use of the spring-boot-maven-plugin to simplify the process of packaging Spring Boot 
applications into Docker images. The plugin allows developers to easily create a Docker image without manually writing 
a Dockerfile, while also optimizing the image structure by layering dependencies for better caching. The article 
explains how to configure the image name, build the Docker image using Maven, and analyze the resulting layers for more 
efficient deployment.

---

<div class="Article-Text"><span><h2>Spring Boot Plugin</h2>
<p>Spring Boot simplifies development to the maximum. Added a couple of starters, filled in
    the application.properties, and voilà, the microservice is ready. Seriously, take a look at the Spring Data REST
    project, which generates controllers based on JpaRepository.</p>
<p>Obviously, something was also invented
    for containerization. And it's the good old spring-boot-maven-plugin. It can not only transform a regular JAR into a
    JAR file with an embedded Tomcat but also build a full-fledged Docker image.</p>
<p>First, in the plugin
    configuration, let's specify the name of the future image. If you don't specify a tag, it will automatically be set
    to the latest.</p>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">    <build>
    &nbsp;&nbsp;<plugins>
    &nbsp;&nbsp;&nbsp;&nbsp;<plugin>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<groupid>org.springframework.boot</groupid>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<artifactid>spring-boot-maven-plugin</artifactid>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<configuration>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<imagename>upagge/spring-boot-docker:spring-plugin</imagename>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<configuration>
    &nbsp;&nbsp;&nbsp;&nbsp;<plugin>
    &nbsp;&nbsp;<plugins>
    </plugins></plugin></configuration></configuration></plugin></plugins></build>
</pre>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"># Image version
# If you want to specify the image version, you can do so using Maven project variables:
<imagename>upagge/spring-boot-docker:${project.version}</imagename>
</pre>
<p>To build, run the command:</p>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">mvn spring-boot:build-image</pre>
<p>And voilà, we have a working image. Let's explore the layers created by Spring:</p>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">dive upagge/spring-boot-docker:spring-plugin</pre>
<p>
    <img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00008-1.jpg">
    <br>
</p>
<p>The created image weighs 309 megabytes, which is 139 megabytes less than the one we built ourselves. But even more
    notable is the structure of the image.</p><p></p>
<img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00008-2.jpg">
<p></p>
<ul>
    <li>63 mb - still Linux;</li>
    <li>24 mb - various certificates;</li>
    <li>1.4 kb - clearly adds a user, on behalf of which the application will run;</li>
    <li>157 mb - layer with JDK;</li>
    <li>53 mb - separate layer of release dependencies;</li>
    <li>252 kb - layer with all Spring Boot loaders;</li>
    <li>14 kb – layer of snapshot dependencies;</li>
    <li>34 kb - actual code we wrote and resources for it;</li>
</ul><p></p><p>An important optimization has been made here - application dependencies are placed in separate layers.
    Thanks to this, they will also be cached and reused by Docker. Therefore, when making changes to the code, you will
    be sending not 53 megabytes (jar weight), but only 3-5 mb.</p><p>Moreover, an important feature is that snapshot
    dependencies are placed in a separate layer from the release dependencies. After all, the likelihood of their
    changes is much higher.</p><p>Let's launch our container.</p>
<p>
    <img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00008-3.jpg">
    <br>
</p>
<p>Notice how much information was provided to us before starting. Spring has made some optimizations for us, as
    reported in this log:</p><p></p>
<ol>
    <li>It clearly still doesn't know how to build images for M1.</li>
    <li>Set up 5 active processors.</li>
    <li>Calculated available memory for JVM. And then distributed it.</li>
    <li>Displayed all additional keys applied at startup.</li>
</ol><p></p><h2>Conclusions on the spring-plugin</h2><p>An even simpler packaging method that uses optimizations because
    it understands the peculiarities of Spring Boot Java applications. The main thing is to monitor what it does under
    the hood so that these advantages do not turn into problems.</p>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"><p>If you have an arm processor, the image will still be built for amd64.</p></pre>
<p>A separate user is created to run the application. This is considered a more secure method.</p><p>Also, we do not
    need to create a Dockerfile, which does not give us the flexibility in image settings needed for complex
    projects.</p><p>A good packaging method for simple pet projects.</p>
</span></div>