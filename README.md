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

### Giving your bucket public access
1. Navigate to Permissions
2. Navigate to Bucket Policy
3. Enter the following JSON:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::jfl9760/*"
        }
    ]
}
```
4. Save

### Making your bucket a static website
1. Navigate to your bucket overview page by clicking on the name of your bucket (Clicking on its row will highlight it but not navigate to the bucket overview page)
2. Add all the files from the [web directory](./web) not including the directory itself. The structure of the S3 bucket should look like this: 
![alt-text](https://github.com/jflaboe/AWS-Workshop/blob/master/docs/images/s3%20example.JPG)
3. Navigate to Properties and select "Static website hosting." Activate "Use this bucket to host a website," change the index document to "index.html" and press "Save."
4. Re-open the "Static website hosting" card, and follow the link to your endpoint. You should see your static website!
  
You'll notice some tabs for adding users and searching users... This is for the second part of the workshop, where we'll add a user database functionality to our website.

## Part 2: Adding and Searching users using API Gateway, Lambda, and RDS
In this portion, you'll create a REST API that your static website can use to make the sites content dynamic. The services used in the backend of this service is API Gateway, Lambda and Relational Database Service (RDS for short). If you're working on your own, you'll have created your own RDS instance in the [development environment setup](./docs/env_setup.md), but for the sake of the workshop I've created one that we'll all be sharing, so you only need to create two Lambda functions and an API Gateway.

### Setting up the development environment for Lambda functions
Lambda functions are (relatively) small pieces of code that are run on Amazon's dedicated Lambda servers. Even though we are using Amazon's servers, we are still creating a ***Serverless*** application because we don't have to actually manage any servers. Lambda code should be developed from your local machine, and then uploaded to AWS when it's ready to be used. While many languages are supported by AWS Lambda, we will be using **Python** for this workshop.

### Installing/Setting up Python
We will be using Python 3 along with pip, so make sure those are installed correctly. Try:
```
python -V
```
or 
```
python3 -V
``` 
in a terminal. This should output the version of Python. If you get an error or your version is not >3.0, please install Python.


Similarly for pip:
```
pip -V
```
or
```
pip -V
```
Make sure pip is associated with the same Python version >3.0 as before


Last, we will be using virtual environments to simulate the environment that each Lambda will be working in:
```
pip install virtualenv
```

### Creating a virtual environment and deployment package
You will need to repeat these steps for our two Lambda functions: **add-user** and **get-user**.
1. Navigate to ./lambda_functions/{function-name}
2. Run the following command to create a virtual environment:
  ```
  virtualenv env
  ```
3. Activate/Enter your virtual environment

  On macOS/Linux
  ```
  source env/bin/activate
  ```
  
  On Windows
  ```
  .\env\Scripts\activate
  ```
  
4. Install the necessary packages (requirements.txt is the list of dependencies)
  ```
  pip install -r requirements.txt
  ```
5. Make changes to the code:
   - in lambda_function.py, change the variable called "rds_host" to "dotdev-workshop.cluster-cwujtc69zdof.us-east-2.rds.amazonaws.com"
   - The RDS host is the endpoint of the database we are using
 
6. Build the deployment package
   1. Save dependencies:
  
   ```
   pip freeze > requirements.txt
   ```
  
   2. Make a deployment directory
   ```
   mkdir deploy
   ```
   
   3. Install dependencies in the deployment directory
   ```
   pip install -r requirements.txt -t deploy
   ```
   
   4. Copy the python files to the deployment directory
   
      On macOS/Linux
   ```
   cp *.py deploy
   ```
   
       On Windows
       
   ```
   copy *.py deploy
   ```
   
   5. Zip the files into a deployment package
      - For Windows, navigate into the 'deploy' directory, highlight all the files using Ctrl+A, then right click and press "Send to -> zip"
      - For macOS/Linux, navigate into the deploy directory with the terminal, and run the following command:
      
      ```
      zip -r deploy.zip *
      ```

### Configuring a Lambda in AWS
Perform the following steps for each lambda function
1. Navigate to the Lambda Service Console in AWS, then select "Create Function"
2. Name your function {your NetID}-{function-name}
3. Select a runtime language of Python 3.8
4. Expand "choose or create an execution role" and choose the existing execution role called "lambdafullaccess" then create the function

You'll now be in the Lambda configuration page for that function, and you'll need to do the following
1. Under "Function Code", change the code entry type from "Edit code inline" to "upload a .zip file" and upload the deployment zip we made before
2. Scroll down and change the timeout in basic settings to 1 minute
3. Under "Network", choose the default VPC (this is where the RDS instance is located). Choose any 2 subnets and choose the default security group
4. Press "Save" in the top right-hand corner of the screen


### Creating a REST API with API Gateway
Navigate to the API Gateway Service console within AWS. We'll need to create a new API. Make sure you name it with your **netID**. Keep all the default settings the same, just enter the name of your API.

For each Lambda function, we'll need to create a corresponding REST API Resource
1. In the resources section, select the "Actions" Dropdown and select "Create Resource"
2. Name your resource after the function. For me, the resource names were called "add-user" and "get-user"
3. Once you have created the resource, make sure it is selected, go to "Actions" again and select "Create Method"
4. Using the Dropdown, make it a POST method. A page will open
5. Check the box "Lambda proxy integration"
6. Enter the name of the corresponding lambda function

Once you've added both REST API methods, it's time to deploy the API Gateway.
1. Select "Actions" and press "Deploy API"
2. Select "[New Stage]" and call it whatever you'd like (I called mine test)
3. Deploy and take note of the "Invoke URL"


### Adding the API functionality to the website
Take the Invoke URL you got from the deployment, and set the variable "API_URL" in [main.js](./web/js/main.js) to this URL. Then, re-upload the web files to your S3 bucket, and your website should be fully functioning!
  
  
