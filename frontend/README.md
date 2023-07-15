# Frontend

Contains source code for the React single page application. The full frontend lives here and will send requests to the backend to get data when necessary. These requests (mostly) make use of some custom hooks (forex. `useGetWeekLists`, `useCreateShoppingItem`) which themselves wrap custom hooks for HTTP calls like `useGet` and use `usePost`.

Authorization is done by sending the username and password to the backend to get a login token which is then send with every request in the `Authorization` header. The token is saved in localStoragea and provided to the whole application by a global react context.  

# Directory structure (roughly)

```
.
├── src
|   ├── components      # reusable react components
|   ├── pages           # page react components/views
|   ├── css
|   |    ├── components # stylesheets for reusable components
|   |    └── pages      # stylesheets for page components
|   |
|   └── hooks           # custom react hooks
|
├── public              # static files
└── docker_files        # files used for deployment, forex. configuration files
```

# Known Issues/possible improvements
- Switch from CRA to vite
- Implement cleanup functions for useEffect fetches
- CSS is split across files inconsistently
- Naming inconsistencies/general code quality improvements (`==` vs `===`)
- Switch to Typescript
- Many more...
