// fs is a Node.js module that let's you read files from the file system.
// path is a Node.js module that let's you manipulate file paths.
// matter is a library that let's you parse the metadata in each markdown file.
// In Next.js, the lib folder does not have an assigned name like the pages folder,
// so you can name it anything. It's usually convention to use lib or utils.

// In lib / posts.js, we’ve implemented getSortedPostsData which fetches
// data from the file system.But you can fetch the data from other sources,
// like an external API endpoint, and it’ll work just fine:
//
// export async function getSortedPostsData() {
//   // Instead of the file system,
//   // fetch post data from an external API endpoint
//   const res = await fetch('..');
//   return res.json();
// }
//
// You can also query the database directly:

// import someDatabaseSDK from 'someDatabaseSDK'

// const databaseClient = someDatabaseSDK.createClient(...)

// export async function getSortedPostsData() {
//   // Instead of the file system,
//   // fetch post data from a database
//   return databaseClient.query('SELECT posts...')
// }

// Using getServerSideProps:
// Here’s the starter code for getServerSideProps.
// It’s not necessary for our blog example, so we won’t be implementing it.

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       // props for your component
//     },
//   };
// }
// Because getServerSideProps is called at request time,
// its parameter(context) contains request specific parameters.

// You should use getServerSideProps only if you need to pre-render
// a page whose data must be fetched at request time.

// SWR
// The team behind Next.js has created a React hook for
// data fetching called SWR.
// We highly recommend it if you’re fetching data on the client side.
// It handles caching, revalidation, focus tracking, refetching on interval,
// and more.We won’t cover the details here, but here’s an example usage:

// import useSWR from 'swr';

// function Profile() {
//   const { data, error } = useSWR('/api/user', fetch);

//   if (error) return <div>failed to load</div>;
//   if (!data) return <div>loading...</div>;
//   return <div>hello {data.name}!</div>;
// }

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
// added in Dynamic Routes - step 6: Render Markdown
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

// Implement getStaticProps
// We need to fetch necessary data to render the post with the given id.
// To do so, open lib / posts.js again and add the following getPostData
// function at the bottom. It will return the post data based on id:

// added in Dynamic Routes - step 6: Render Markdown
// update the getPostData() function in the same file as follows to use remark:
// export function getPostData(id) {
//   const fullPath = path.join(postsDirectory, `${id}.md`);
//   const fileContents = fs.readFileSync(fullPath, 'utf8');

//   // Use gray-matter to parse the post metadata section
//   const matterResult = matter(fileContents);

//   // Combine the data with the id
//   return {
//     id,
//     ...matterResult.data,
//   };
// }
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  // Important: We added the async keyword to getPostData because we
  // need to use await for remark.async / await allow
  // to fetch data asynchronously.

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}