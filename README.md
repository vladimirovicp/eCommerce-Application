# eCommerce-Application

Welcome to _Holy Grail_! We are proud to present our new, convenient, and easy-to-use application. Whether you are a novice or an experienced cyclist, you will be able to find your perfect bike and unlock the joy and freedom of riding. 

## About the project
_Holy Grail_ is created as a final studying assignment for the [RSSchool](https://rs.school/) JS/Front-end course, completed by [asimo-git](https://github.com/asimo-git), [vladimirovicp](https://github.com/vladimirovicp), and [svorokhobina](https://github.com/SVorokhobina).   
The project's primary purpose is to design a detailed, true-to-life imitation of real e-commerce applications, where visitors could quickly and effortlessly browse, select, and order preferred products from the available range. Among the implemented features, the application includes customer registration and authorisation forms and a shop catalogue with filtering, sorting, and searching functions. Customers are able to view the detailed item descriptions or move to the product pages for more information, add the chosen items to the cart, and proceed to checkout to finalise their orders. The application is designed using [Commercetools](https://commercetools.com/), one of the leading cloud-based commerce platforms.

### Technology stack used in the project
- Typescript / Javascript
- SCSS
- Webpack
- ESLint / Prettier
- Husky
- Jest
- Commercetools

## Project setup
Please follow the instructions below to configure and run the project locally:
1. The project requires Node.js (version 20 or higher) to be installed, so please visit [Node.js website](https://nodejs.org/) to download or update it;
2. Clone the repository:      
`git clone https://github.com/vladimirovicp/eCommerce-Application`;
3. Change the directory to the project folder:   
`cd eCommerce-Application`;
4. Install project dependencies running the `npm install` command;
5. The project can be viewed with the `npm run start` command.

### Scripts
Please use the `npm run` command followed by the name of one of the listed below project scripts to run it: 
- `start`: starts a webpack development server;
- `build`: compiles a production-ready project using webpack;
- `lint`: analyses project source files to enhance code quality using ESLint (Airbnb style guide);
- `fix`: automatically resolves code issues in project source files;
- `ci:format`: checks whether source files are properly formatted and outputs a list of files to be formatted if there are any;
- `format`: allows to automatically format source files in-place;
- `prepare`: installs Git hooks;
- `test`: runs file tests using Jest;