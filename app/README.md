# ReactJS Template Directory
This directory forms a seperate NPM package.

## Getting started
Create a new project by cloning this repo.

- Template file `src/index.html`
- Do not touch `src/index.js`
- Add components to `src/components/*.jsx`
- Add browser JS modules to `src/scripts/*.js`
- Add global CSS to `src/styles/global.css`
- Add local styles in `src/styles/*.module.css`
- Add images and fonts in `public/`

*Note*: All `public` resources should be loaded in `.css` and `.jsx` files with respect to `@public/`.
However, when using HTML in JSX (like an `img` tag, publi resources should be loaded wrt `/`)

## Run server
```
npm install
npm start
```

## Build
You may build the app and serve it statically in say a python server
```
npm install
npm run build
python -m http.server --bind 127.0.0.1 -d static 8080
```
