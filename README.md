This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). This framework utilizes file-system routing, which means that it automatically sets up routes according to the file system of the project. More about this is found on the NextJs documentation here: (https://nextjs.org/docs/routing/introduction).

## Setting up the project for development

Install the following:

```
Node version 14.15.5
JDK 11.0.10
Maven 3.6.3
```

## Frontend

```
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

The project runs on port 3000.

## General info on architecture


The index.tsx page is the landing page. This redirects to the home dashboard rather than being an actual landing page. Do not confuse it as such. The reason for this is that users are meant to land as quickly as possible at the most relevant dashboard for the user.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
