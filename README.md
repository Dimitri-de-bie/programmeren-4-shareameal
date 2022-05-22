# programmeren-4-share-a-meal-API

## Name

Project api share-a-meal

## Description

This is a project I made for Avans hogeschool for the "programmeren 4" course. This project is a api that allows you to create,read,update, delete (CRUD) users, and meals is missing update. It also has a user login function so that you have to be logged in with a token in order for you to access the secured parts of the api. The project includes testcases which automaticly tests if the app is working as intended. The api is also running on https://dimitri-sharemeal.herokuapp.com/ using a mysql database. The project is based on a project from course "programmeren 3" where I had to make a android application using a api with the same functionalities. There is also a mysql script included in the project to make a correct database.

## Badges

![Deploy to Heroku](https://github.com/Dimitri-de-bie/programmeren-4-shareameal/actions/workflows/main.yml/badge.svg)

## Installation

You can install this project by pressing gitclone repository, once you cloned the project you can head over to the location you downloaded the project inside the commandline(you can find this by typing cmd in your windows searchbar). When you made your way over to the location you can type npm install and npm start. Once you did this you succesfully installed the project. You will also need to import the database using the included mysql script.

tl;dr:

- git clone repository
- npm install
- npm start
- (run the share-a-meal.sql script for the correct database.)

## Usage

You can create, read, update and delete users and meals is missing update. This works with a mysql database which needs to be installed localy. This can be done by running "share-a-meal.sql". There are also tests included in the project, these test can be run by typing "npm run test" in the commandline.

## Authors and acknowledgment

Project made by: Dimitri de Bie Studentnummer: 2183269

## Project status

Project not fully finished.
All the essentials are there and working but some of the optional functions are missing.
