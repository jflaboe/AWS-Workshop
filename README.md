# AWS-Workshop
A repository dedicated to teaching some AWS tools related to scalable/serverless systems. This workshop is being taught as a part of a DotDev event. As such, some of the setup will be streamlined as I have created a *dotdev* AWS user under my own account. These credentials will continue to be available for a few days after the workshop. If you would like to complete this tutorial without those credentials, see [here](./docs/env_setup.md) for how to set up the development environment.

The actual workshop will contain two portions:
1. A presentation giving a brief background about how applications are built in general, what AWS and cloud providers are, and how we can use AWS to build applications.
2. Time for workshop attendees to actually get their hands dirty and build a small web application using S3, API Gateway, Lambda, and RDS from AWS

This repository mostly focuses on the second portion of the workshop, but I have also provided the background information for the sake of completion, see [here](./docs/background.md).

## Clone this Repository
```
git clone https://github.com/jflaboe/AWS-Workshop.git
```

## Logging in to AWS
If you had to go through the development environment setup, you've created an AWS account yourself, so you can ignore this section.

Otherwise, navigate to the [AWS Console Login](https://940085495355.signin.aws.amazon.com/console) and enter the following:
- Username: dotdev
- Password: dotdev2019


## Part 1: Creating a Static Website with Amazon S3

### What is a static website?
A static website is a web application whose content does not change regardless of the user of the content. More generally, a static website is a website made from static components. Those static components incude HTML, CSS, and JS files, as well as images, videos and much much more. A static website is perfect for a personal website, as they are cheap and easy to manage.

### Editing the content
Browse the web directory of this repository. In it you will see a common static website directory structure. The .html file is in the main directory while the CSS and JS are in their own sub-directories. I've built most of the website for you, but you should do a little bit of personalization. 
- In [index.html](./web/index.html), you should change the h1 header to contain your name. 
- Update the "About" Tab: I've made most of this website using [ReactJS](https://reactjs.org/), so some of the content you need to change is in the [Javascript](./web/js/main.js). Here you should navigate to the react component called [About](./web/js/main.js#L124) and change the information here to something about yourself.

### Hosting a Static Website in S3
Once you're logged into the AWS Console, you need to navigate to the S3 Console. I've provided a link [here](https://s3.console.aws.amazon.com/s3/home?region=ca-central-1), but you should try navigating to the S3 service on your own using AWS's built-in navigation.

#### Create a new bucket
Go ahead and press "Create Bucket." There are four sections to the setup:
1. Name and Region: Please choose a US-east region or a Canada (Central). Also, **make your NetID part of the name of your bucket**, so it will be easy to identify.
2. Configure options: leave the defaults, just press "Next"
3. Set Permission: **uncheck** Block all public access
4. Review: press "Create bucket"

### Adding files to your bucket
  
