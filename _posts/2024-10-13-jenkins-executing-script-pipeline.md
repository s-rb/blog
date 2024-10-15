---
title: 'Jenkins: executing script over ssh in a pipeline'
layout: post
post-image: /assets/images/posts/2024/00006-1.png
description: This guide demonstrates executing remote scripts through Jenkins Pipelines using SSH authentication and 
  the sshPublisher plugin, detailing configuration and execution steps.
tags:
- ssh
- post
- jenkins
- publish
- pipeline
---

This article explains how to use the Jenkins Pipeline with the sshPublisher plugin to run a bash script on a remote 
server. It covers key steps, such as setting up server authentication by generating and copying SSH keys, configuring 
Jenkins with the necessary plugin, and running the pipeline to transfer and execute files remotely. The final step is 
testing and verifying the pipeline output on the remote server.

---

<div class="Article-Text"><span><div>In this post, I'll demonstrate the process of executing a bash script on a remote server using a Jenkins Pipeline
    Step with the sshPublisher plugin.
</div>
<div><br></div>
<h2>Server authentication setup</h2>
<div><br></div>
<div>Generate a new key pair by logging in with the Jenkins service user and creating a key pair without a passphrase
    (leave it blank or set it for private key security):<br><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"># using the service user
sudo su -s /bin/bash jenkins
# generate key pair
ssh-keygen -f ~/.ssh/id_pipessh -t rsa
</pre>
<div><br></div>
<div>The private key ('id_pipessh') and the public key ('id_pipessh.pub') will be created in ~/.ssh</div>
<div><br></div>
<div>Copy the public key to the remote server:</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">ssh-copy-id -i ~/.ssh/id_pipessh.pub user@host</pre>
<div><br></div>
<div># if the ssh-copy-id command is not available, do it manually</div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">cat ~/.ssh/id_pipessh.pub | ssh user@host "mkdir -p ~/.ssh &amp;&amp; touch ~/.ssh/authorized_keys $$ chmod -R go= ~/.ssh &amp;&amp; cat &gt;&gt; /.ssh/authorized_keys"</pre>
<div><span style="font-weight: bold;"><br></span></div>
<div>Note: If the password prompt is disabled on the remote server, ask the administrator to add your public key to the
    file '/.ssh/authorized_keys' (create it if it doesn't exist) and ensure proper permissions:
</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh/</pre>
<div>2. Enable key authentication on the remote server by editing the /etc/ssh/sshd_config file and ensuring that
    'PubkeyAuthentication yes' is set. Save it and restart the sshd service. In my case, I'm using an RHEL server:
</div>
<div><br></div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">sudo systemctl restart sshd</pre>
<div><br></div>
<div>Test the connection:</div>
<pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);"># using verbose mode -v
ssh -i ~/.ssh/id_pipessh user@host -v</pre>
<div><br></div>
<h2>Jenkins setup</h2>
<div><br></div>
<div>Install the plugin by navigating to Manage Jenkins &gt; Manage Plugins &gt; Available, check 'Publish Over SSH',
    and select 'install without restart'.<br><br><img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00006-2.jpg"><br></div>
<div><br></div>
<div>Configure the ssh key in Jenkins by going to Manage Jenkins &gt; Configure System &gt; Publish over SSH. Select the
    Add button &gt; Advanced to set configuration. Complete the fields Name, Hostname, Username, Remote Directory, check
    the option 'Use password authentication, or use a different key', set the Passphrase (if applicable), and Path to
    key to the private key.
</div>
<div><img style="height: auto; display: block; margin: auto; max-width: 500px;" src="/assets/images/posts/2024/00006-3.jpg"><br></div>
<div><br></div>
<div>Finally, click 'Test Configuration' to validate if everything is set up correctly.</div>
<div><br></div>
<div>Create a new Pipeline and add the script content for creating two text files in a zip to be transferred to the
    remote server for unzipping.
</div>
<div><br></div>
<div><pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">    pipeline {
  agent any
  stages {
    stage('ssh') {
      steps {
        script{
          cleanWs()
          sh "echo 'hello' &gt;&gt; file1.txt"
          sh "echo 'hello' &gt;&gt; file2.txt"
          sh "zip -r oneFile.zip file1.txt file2.txt"
          echo 'Local files.....'
          sh 'ls -l'
          command='''
          unzip -o -d ./ oneFile.zip
          ls -l
          date
          cat /etc/os-release
          '''
        }

        // Copy file to remote server
        sshPublisher(publishers: [sshPublisherDesc(configName: 'dummy-server',
        transfers: [ sshTransfer(flatten: false,
        remoteDirectory: './',
        sourceFiles: 'oneFile.zip'
        )])
        ])
      }
    }
}
}

</pre>
</div>
<div><br></div>
<div>Save and execute the pipeline.</div>
<div><br></div>
<div>Jenkins output log:<br>
    <pre style="font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-stretch: normal; font-size: 12px; line-height: 18px; font-family: Consolas, Monaco, Monospaced, monospace; margin-top: 5px; margin-bottom: 5px; padding: 5px; vertical-align: baseline; border: 1px solid rgb(154, 154, 154); outline: 0px; background-image: none; background-position: 0px 0px; background-repeat: repeat; background-attachment: scroll; background-color: rgb(241, 241, 241); max-width: 100%; overflow: auto; color: rgb(64, 64, 64);">[Pipeline] {
[Pipeline] stage
[Pipeline] { (ssh)
[Pipeline] script
[Pipeline] {
[Pipeline] cleanWs
[WS-CLEANUP] Deleting project workspace...
[WS-CLEANUP] Deferred wipeout is used...
[WS-CLEANUP] done
[Pipeline] sh
+ echo hello
[Pipeline] sh
+ echo hello
[Pipeline] sh
+ zip -r oneFile.zip file1.txt file2.txt
  adding: file1.txt (stored 0%)
  adding: file2.txt (stored 0%)
[Pipeline] echo
Local files.....
[Pipeline] sh
+ ls -l
total 12
-rw-r--r--. 1 jenkins jenkins   6 jun 22 19:36 file1.txt
-rw-r--r--. 1 jenkins jenkins   6 jun 22 19:36 file2.txt
-rw-r--r--. 1 jenkins jenkins 326 jun 22 19:36 oneFile.zip
[Pipeline] sshPublisher
SSH: Connecting from host [dummy]
SSH: Connecting with configuration [dummy-server] ...
SSH: Disconnecting configuration [dummy-server] ...
SSH: Transferred 1 file(s)
[Pipeline] sshPublisher
SSH: Connecting from host [dummy]
SSH: Connecting with configuration [dummy-server] ...
SSH: EXEC: STDOUT/STDERR from command [
                        unzip -o -d ./ oneFile.zip
                        ls -l
                        date
                        cat /etc/os-release
                    ] ...
Archive:  oneFile.zip
 extracting: ./file1.txt
 extracting: ./file2.txt
total 16
-rw-r--r--. 1 asanchez asanchez    6 jun 22 19:36 file1.txt
-rw-r--r--. 1 asanchez asanchez    6 jun 22 19:36 file2.txt
-rw-rw-r--. 1 asanchez asanchez  326 jun 22 19:36 oneFile.zip
drwxrwxr-x. 2 asanchez asanchez 4096 jun 20 23:31 out
mié jun 22 19:36:22 CDT 2022
NAME="Red Hat Enterprise Linux Server"
VERSION="7.4 (Maipo)"
ID="rhel"
ID_LIKE="fedora"
VARIANT="Server"
VARIANT_ID="server"
VERSION_ID="7.4"
PRETTY_NAME="Red Hat Enterprise Linux"
ANSI_COLOR="0;31"
CPE_NAME="cpe:/o:redhat:enterprise_linux:7.4:GA:server"
HOME_URL="https://www.redhat.com/"
BUG_REPORT_URL="https://bugzilla.redhat.com/"

REDHAT_BUGZILLA_PRODUCT="Red Hat Enterprise Linux 7"
REDHAT_BUGZILLA_PRODUCT_VERSION=7.4
REDHAT_SUPPORT_PRODUCT="Red Hat Enterprise Linux"
REDHAT_SUPPORT_PRODUCT_VERSION="7.4"
SSH: EXEC: completed after 200 ms
SSH: Disconnecting configuration [dummy-server] ...
SSH: Transferred 0 file(s)
[Pipeline] }
[Pipeline] // script
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS</pre>
<br>And that is all!
</div></span></div>