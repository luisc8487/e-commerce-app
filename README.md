# E-Commerce Web Application

## Overview
I created an e-commerce web application using **JavaScript, Node.js, Express.js, Cookie Session, Nodemon, Multer and Express Validator**.

## Project Purpose
The goal of this project was a to build a front-end web application that allows users to "fake shop" for about 10 smaple items. Key features include:  
- Users who haven't signed in can still add items to their shopping cart.
- Signed-in users have their cart data associated with a **cart ID**, linking different products through a **product ID**
- Users can create new products with a **title, price, and image**.

## Data Storage
Instead of using a database, I used multiple **JSON file** to store:
- **User Data**
- **Item Data**
- **Cart Data**

## Authentication & User Privileges
To ensure security and proper user-specific access: 
- Implemented Cookies Session to track logged-in users.
- Verified the session every time a user accessed a new route or endpoint.
- Assigned a userId property to logged-in users, allowing them to:
    - Access their admin account.
    - View their created products, including quantity and total amount.

