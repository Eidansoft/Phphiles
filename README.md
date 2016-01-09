# Phphiles
PHPhiles is an API solution created just for fun :-) to easily manage files at my hosting server through HTTP calls and XML/JSON responses.
This application has been developed by [my-self](https://www.linkedin.com/in/alejandro-d%C3%A9cimo-8b91b672) at my spare time. All sources are available at the [GIT repository](https://github.com/Eidansoft/Phphiles) on Github. Please feel free to try it out or giving me your feedback. I hope you enjoy.

# Description
The code has two parts, first some php scripts to run at server; and by other hand an AngularJS module to easely show/manage the files. You can use both parts toghether or just the part you need.

The php scripts are three files at **php_scripts** folder:
 - **configuration.php.inc** To configure main options.
 - **funciones.php.inc** With the functions to process the query, perform the operations into the file system and create the valid response.
 - **phphile.php** Http callable script. Check the query parameters and session to detect any non-valid behaviour from the user. If it's all ok pass the control to the functions file.

The check list for accept a query is:
 - **format** parameter is mandatory and must contain a valid format (XML, JSON or FILE).
 - The session **phpidesession** must exist to be sure that is an authorized user.
 - **path** and **operation** parameters are mandatory.
 - **operation** parameter must be one of the valid operations values defined at **configuration.php.inc**.
 - **path** parameter cannot contain two points ("..") in order to avoid to get/manage files upper than the root folder level configured into **configuration.php.inc**. And this parameter cannot contain double slash ("//") neither.
 - First character for **path** parameter must be a slash ("/").

# Demo
This project is used into some of my other projects:
 - [PhpIde](https://github.com/Eidansoft/PhpIde)

If you use it at your project, let me know and I'll update this list.

# Compilation / configuration
This application is built in PHP plus AngularJS; but you can use only the part you need.

For the server service, you'll need to copy the files into **php_scripts** at your server with PHP support. By the way at the file **configuration.php.inc** you can configure some things:
 - The valid/accepted operations
 - The root path to work at the server

In order to get the AngularJS module to use into your web application, you just need to include the **target/phphile-x.x.x.js** and **target/phphile-x.x.x.css** into your dependencies and use it.

# Changelog
V1.1 Added AngularJS module to show/manage files at a web aplication.

V1.0 First working version with the operations:
 - Save files (new or modify)
 - Get the list of files
 - Get a file
 - Create a folder
 - Delete a file

# Dependencies
 - PHP 5 >= 5.2.0


# License
GPLv3
This code is [GPLv3](http://www.gnu.org/licenses/gpl-3.0.en.html) licenced:

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.