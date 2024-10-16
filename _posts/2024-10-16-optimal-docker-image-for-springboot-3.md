---
title: 'The optimal Docker image for Spring Boot. Part 3'
layout: post
post-image: /assets/images/posts/2024/00009-0.jpeg
description: Jib is a Google tool that simplifies building Docker images without Docker, optimizing image layers and 
  supporting direct registry deployment.
tags:
- springboot
- docker
- optimization
- image
- post
---

The Jib plugin is an open-source tool developed by Google that allows developers to build Docker images without 
needing Docker installed or writing a Dockerfile. It integrates directly with Maven and Gradle, creating Docker 
images by layering dependencies and resources efficiently. Jib also supports both local and remote builds, sending 
images directly to registries like Docker Hub, while producing slightly larger images compared to traditional methods.

---

<div class="Article-Text"><span><h2>Jib plugin</h2>
<div>This is an open-source tool from Google that doesn't require Docker to work. You also don't need to write a
    Dockerfile.
</div>
<div><br></div>
<div>To use Jib, add the following to your pom.xml:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">
&lt;build&gt;
&nbsp; &nbsp; &lt;plugins&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;plugin&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;groupid&gt;org.springframework.boot&lt;/groupid&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;artifactid&gt;spring-boot-maven-plugin&lt;/artifactid&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/plugin&gt;
&nbsp; &nbsp; &lt;/plugins&gt;
&lt;/build&gt;
</pre>
<div><br></div>
<h2>Building without Docker</h2>
<div>One of the advantages of this plugin is building without installing Docker:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">    mvn compile jib:build
</pre>
<div><br></div>
<div>After the build, I searched for the image in my local storage. Then it hit me. In this mode, Docker is not used, so
    the image was sent to the registry on Docker Hub.
</div>
<div>Pull the image and analyze it using dive:</div>
<div><br></div>
<div>
    <img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00009-1.jpg">
    <br>
</div>
<div><br></div>
<div>The final weight came out to be 321 MB, which is 12 megabytes more than the previous method. Among them:</div>
<div><br></div>
<div>
    <img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00009-2.jpg">
    <br>
</div>
<div><br></div>
<div>
    <ul>
        <li>78 + 48 MB - Linux and various certificates.</li>
        <li>140 MB - JDK.</li>
        <li>55 MB - layer with release dependencies.</li>
        <li>14 KB - layer with snapshot dependencies.</li>
        <li>981 bytes - only resources. Resources folder.</li>
        <li>22 KB - our written code.</li>
    </ul>
</div>
<div>Jib runs your image on behalf of the root user.</div>
<div>Similar to the Spring plugin, Jib separates dependencies into separate layers, but it goes even further and creates
    a separate layer for the resources folder. After all, resources are also rarely changed but can weigh a lot. For
    example, if you have many Liquibase migration scripts.
</div>
<h2>Building using Docker</h2>
<div>For this, add the plugin as in the previous step but run a different command:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">    mvn compile jib:dockerBuild
</pre>
<div><br></div>
<div>The size and structure of the layers are no different from the image we built without Docker.</div>
<h2>Conclusions on Jib</h2>
<div>If you have an ARM processor, the image will still be built for amd64.</div>
<div>I have never used this plugin in projects, only heard about it, so I can't make any deep conclusions. It surprised
    me that it can work without Docker; sometimes this can be useful. But I don't see the point in using it when there
    is a Spring plugin available.
</div></span></div>