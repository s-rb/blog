---
title: 'The optimal Docker image for Spring Boot. Part 4'
layout: post
post-image: /assets/images/posts/2024/00010-0.jpeg
description: The article demonstrates how to write optimized Dockerfiles using multi-stage builds, minimizing the image 
  size by customizing the JDK and organizing dependencies into layers.
tags:
  - springboot
  - docker
  - optimization
  - image
  - post
---

The article explores the process of building optimized Dockerfiles by reducing the size of the JDK using Java modules 
and determining necessary dependencies with the jdeps tool. It also introduces multi-stage Docker builds, where the 
JDK is custom-built in the first stage and then added to a minimal Linux image in the second stage, keeping the final 
image as lightweight as possible. This approach not only reduces the image size but also enhances control over the 
build, making it a flexible and efficient solution for large systems.

---

<div class="Article-Text"><span><h2>Advanced build with Dockerfile</h2>
<div>If you want something done right, do it yourself. No plugin knows your application like you do. So the next level
    is writing optimized Dockerfiles.
</div>
<div><br></div>
<div>The first thing we'll do is reduce the JDK size. This is possible thanks to modules added since Java 9. All classes
    in the JDK have been divided into these modules. We will use only those that are truly necessary.
</div>
<div><br></div>
<div><img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00010-1.jpg"><br></div>
<div><br></div>
<div>But how do you know which modules are needed for the application and which are not? Moreover, you must also
    consider all application dependencies. If they use a class from a module you don't include, the application will
    either fail to build or crash at runtime.
</div>
<div><br></div>
<div>To determine the necessary modules, use the jdeps utility located in the bin folder of your JDK. But first, we need
    to build our JAR and get all dependencies. To do this, run the command:
</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"><div>mvn clean install dependency:copy-dependencies</div></pre>
<div><br></div>
<div>Scan all the obtained JARs:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"><div>jdeps --ignore-missing-deps -q -recursive --multi-release 9 --print-module-deps --class-path 'target/dependency/*' target/*.jar</div></pre>
<div><br></div>
<div>The --multi-release 9 flag may not be suitable for you; try changing it.</div>
<div><br></div>
<div>This command will output the module names used by the application and all dependencies. In my case, they are:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"><div>java.base, java.compiler, java.desktop, java.instrument, java.management, java.prefs, java.rmi, java.scripting, java.security.jgss, java.sql.rowset, jdk.httpserver, jdk.jfr, jdk.unsupported</div></pre>
<div><br></div>
<div>Now that we know which JDK modules are involved in the application, let's build our custom JDK from these modules
    using the jlink utility.
</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"><div>jlink --add-modules [your_modules_here] --strip-debug --no-man-pages --no-header-files --compress=2 --output javaruntime</div></pre>
<div><br></div>
<div>Replace the value for the --add-modules flag with the package names found by jdeps. After running this command, you
    will get a javaruntime folder in the project root. This is a trimmed-down version of the JDK specifically for your
    JAR. In my case, the trimmed version weighs 50 MB, while the full JDK weighs 315 MB.
</div>
<div><br></div>
<div>Now let's optimize the spring-boot-jar. I think it's no secret that you can simply unpack the spring-boot-jar using
    an archiver:
</div>
<div><br></div>
<div><img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00010-2.jpg"><br></div>
<div><br></div>
<div>Here you can find all dependencies, including Tomcat, code, and application resources. It makes sense to organize
    everything into layers as spring-plugin and Jib do.
</div>
<div><br></div>
<div>But before unpacking our JAR with an archiver, let's use the layertools utility. It allows us to unpack our JAR a
    bit smarter.
</div>
<div><br></div>
<div>Create a separate folder and navigate to it:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"><div>mkdir build-app &amp;&amp; cd build-app</div></pre>
<div><br></div>
<div>Then run the unpacking command:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"><div>java -Djarmode=layertools -jar ../target/*.jar extract</div></pre>
<div><br></div>
<div>You should see four folders:</div>
<div>
    <ul>
        <li>application: Your code is here.</li>
        <li>snapshot-dependencies: Snapshot dependencies are here.</li>
        <li>spring-boot-loader: Spring boot loaders are here.</li>
        <li>dependencies: Release dependencies are here.</li>
    </ul>
</div>


<div>Now it's time to combine all this knowledge into a single Dockerfile.</div>
<div><br></div>
<div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">    <div>FROM eclipse-temurin:17 as app-build</div>    <div>ENV RELEASE=17</div><br><div>WORKDIR /opt/build</div>    <div>COPY ./target/spring-boot-*.jar ./application.jar</div><br><div>RUN java -Djarmode=layertools -jar application.jar extract</div>    <div>RUN $JAVA_HOME/bin/jlink \</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;--add-modules `jdeps --ignore-missing-deps -q -recursive --multi-release
        ${RELEASE} --print-module-deps -cp 'dependencies/BOOT-INF/lib/*':'snapshot-dependencies/BOOT-INF/lib/*'
        application.jar` \<br></div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;--strip-debug \</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;--no-man-pages \</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;--no-header-files \</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;--compress=2 \</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;--output jdk</div>    <div>FROM debian:buster-slim</div>    <div>ARG BUILD_PATH=/opt/build</div>    <div>ENV JAVA_HOME=/opt/jdk</div>    <div>ENV PATH "${JAVA_HOME}/bin:${PATH}"</div>    <div>RUN groupadd --gid 1000 spring-app \</div><div>&nbsp; &amp;&amp; useradd --uid 1000 --gid spring-app --shell /bin/bash --create-home spring-app</div>    <div>USER spring-app:spring-app</div>    <div>WORKDIR /opt/workspace</div>    <div>COPY --from=app-build $BUILD_PATH/jdk $JAVA_HOME</div>    <div>COPY --from=app-build $BUILD_PATH/spring-boot-loader/ ./</div><br><div>COPY --from=app-build $BUILD_PATH/dependencies/ ./</div>    <div>COPY --from=app-build $BUILD_PATH/snapshot-dependencies/ ./</div>    <div>COPY --from=app-build $BUILD_PATH/application/ ./</div>    <div>ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]</div>
</pre>
    <div><br></div>
    <div>
        <div>If the project does not use snapshot dependencies, remove 'snapshot-dependencies/BOOT-INF/lib/' from the
            jlink command. Otherwise, the build will fail because the /BOOT-INF/lib/ folders will not exist.
        </div>
        <div><br></div>
        <div>To build this Dockerfile on Windows, replace
            'dependencies/BOOT-INF/lib/':'snapshot-dependencies/BOOT-INF/lib/' with
            'dependencies/BOOT-INF/lib/';'snapshot-dependencies/BOOT-INF/lib/'. The difference lies in the delimiter:
            Linux uses ':', while Windows uses ';'.
        </div>
        <div>It may look intimidating, but by now, you are familiar with most of it. Don't forget to run the command mvn
            clean package to get the target folder with the JAR file.
        </div>
        <div><br></div>
        <div>The Dockerfile contains 2 FROM commands. This is called a multi-stage build. In the first stage, we build
            the necessary JDK for our application, and in the second stage, we build the image. The subtlety here is
            that in the second build stage, we only take the necessary files, namely the JDK files.
        </div>
        <div><br></div>
        <div>Let's break down the first stage. It doesn't matter which base image you specify; the important thing is
            that JDK is installed there. We transfer our JAR there, then unpack it, determine the dependencies used, and
            build the JDK. With that, the first build stage is complete. Let's move on to the second stage.
        </div>
        <div><br></div>
        <div>Here, as the base image, we use an image on which the application will run at runtime. Usually, this is the
            thinnest possible Linux. Next, we specify the JAVA_HOME environment variable and add it to PATH.
        </div>
        <div><br></div>
        <div>After that, we copy our JDK and JAR layers from the previous build stage. To do this, along with COPY, we
            use the --from=app-build flag, which indicates that we are copying files not from our machine but from the
            build stage under the alias app-build. Don't forget about the sequence; the less chance of a layer changing,
            the earlier it is specified. The last line specifies the Spring loader that will launch our application.
        </div>
    </div>
    <div><br></div>
    <div>If desired, you can also separate the resources folder into a separate layer.</div>
    <div><br></div>
    <div>Let's explore the image layers. Our image weighs only 173 MB:</div>
    <div><br></div>
    <div>
        <img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00010-3.jpg"><br></div>
    <div>
        <img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00010-4.jpg"></div>
    <div>
        <ul>
            <li>63 MB — Linux;</li>
            <li>338 KB — added due to user creation;</li>
            <li>56 MB — our custom JDK;</li>
            <li>53 MB — release dependencies;</li>
            <li>252 KB — Spring loaders;</li>
            <li>14 KB — snapshot dependencies;</li>
            <li>34 KB — our code and resources.</li>
        </ul>
    </div>

    <h2>Conclusions on Dockerfile-pro:</h2>
    <div>We've eliminated almost all the downsides of Dockerfiles, turning them into advantages. With this build, you
        have the opportunity to customize everything to your liking. It's worth noting that this is the smallest image
        of all.
    </div>
    <div><br></div>
    <div>You can also use build capabilities for different platforms, a feature that plugins lack.</div>
    <h2>In summary:</h2>
    <div>In this article, we've explored various ways to create images. Each method has its pros and cons.</div>
    <div><br></div>
    <div>If you need quick results, use the spring-boot-maven-plugin or Jib. Remember that they currently cannot build
        images for ARM processors, and Jib runs the application on behalf of the root user.
    </div>
    <div><br></div>
    <div>A properly written Dockerfile will be the best option for a large system. Pay special attention to writing your
        Dockerfile.
    </div>

</div></span></div>