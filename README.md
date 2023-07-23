# Household dashboard

This is a web app to assist with various of our household tasks. For now it's main purpose is to help with making our weekly meal/shopping-lists. The frontend is written with [React](https://reactjs.org/) while the backend is written in python using [Flask](https://flask.palletsprojects.com/en/2.0.x/).

*Note: This is a hobby project initially started to learn about react, so that started as the main focus. This means there are definitely some areas that have gotten less love than they deserve. I would caution anyone to take too much inspiration from my code :)*

## Features
- A database of shopping-items
- Week-lists with reorderable meal-lists and shopping-lists.
	- Shopping-list filled with items from the shopping list and sorted by the store that sells them.
	- Notes on the shopping-list items.
- A designed-by-programmer interface truly only a mother could love.
	- Which is responsive and turns from a single column layout on mobile to a multi-column on wider screens


# Demo

A demo is available at [http://markmeltzer.nl/household-dashboard-demo/](https://hhd-demo.markmeltzer.nl/).

The username and password are "demo".

### Screenshots
| Main page  | Weeklist | Editing weeklist | Shopping item list | Shopping item |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| ![screenshot of the main page](./imgs/main_page_cropped.png)  | ![screenshot of a week list](./imgs/weekList_view_cropped.png) | ![screenshot of a editing week list](./imgs/weekList_edit_cropped.png) | ![screenshot of a editing week list](./imgs/shoppingItems_cropped.png) | ![screenshot of a editing week list](./imgs/shoppingItem_cropped.png) |

# Installation

## Deploy using docker compose

The easiest way to run your own instance of this application is using [docker](https://www.docker.com/). When docker is installed:

1. Modify the variables in the `.env` file to your liking and 
2. If you don't have any existing data create the `users.json`, `db.json` and `archive.json` in `backend/data` by renaming their respective `.example` files.
3. Create the docker containers by running the following command from the root of the repository:

```
docker compose up
```

## Manual install/development

For a manual installation or for development make sure you have [Python](https://www.python.org/) and [npm](https://www.npmjs.com/) installed. In the backend folder run

```
python -m pip install -r requirements.txt
python app.py
```

and in the frontend folder run

```
npm install

# either this to start development server
npm run start

# or this to create a static build
npm run build
```

# Future features
- Save meals as proper objects in database with information on recipes, ingredients, vegetarian etc
	- Provide option to add new meals
	- Suggest previous meals when creating a new WeekList
	- Auto-fill shopping list based on ingredients
- Save shopping items as proper objects in database with information on price, location in store
	- Provide option to add new shopping items
	- Provide estimated price on shopping lists
	- Auto sort shopping list based on location in store for optimal shopping route
- Allow inputting of store reciepts
	- Allow for auto updating shopping item prices
	- Provide shopping statistics
- Expand app to properly support multiple users (logout, register, different access levels)
