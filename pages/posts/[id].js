// FIRST STEP
import Layout from '../../components/layout'
// Dynamic Routes - step 7 Polishing the Post Page
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

// export default function Post() {
//   return <Layout>...</Layout>;
// }

// next...
// paths contains the array of known paths returned by getAllPostIds(),
// which include the params defined by pages / posts / [id].js.
// Learn more in the paths key documentation
// Ignore fallback: false for now — we’ll explain that later.

// LATER...
// Then, open pages/posts/[id].js and replace this line:
// import { getAllPostIds } from '../../lib/posts';
// with the following code:
import { getAllPostIds, getPostData } from '../../lib/posts';
// changed LATER...
// export async function getStaticProps({ params }) {
//   const postData = getPostData(params.id);
//   return {
//     props: {
//       postData,
//     },
//   };
// }
// The post page is now using the getPostData function in getStaticProps
// to get the post data and return it as props.
// Now, let's update the Post component to use postData.

export default function Post({ postData }) {
  return (
    <Layout>
      {/* Add this <Head> tag */}
      <Head>
        <title>{postData.title}</title>
      </Head>
      {/* Add some CSS */}
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  // Example: pages/posts/[...id].js matches /posts/a, but also /posts/a/b, /posts/a/b/c and so on.
  // Note: Returns an array as the value of the id like:
  // return [
  //   {
  //     params: {
  //       // Statically Generates /posts/a/b/c
  //       id: ['a', 'b', 'c'],
  //     },
  //   },
  //   //...
  // ]

  const paths = getAllPostIds()
  return {
    paths,
    // What does fallback mean? If fallback is 'false',
    // then any paths not returned by getStaticPaths will result in a 404 page.
    // If 'true', paths will be rendered to HTML at build time and will not result in a 404 page.
    // Next serves a “fallback” version of the page on the first request to such a path.
    // Next will (background) statically generate the requested path. 
    // Subsequent requests to the same path will serve the generated page,
    // just like other pages pre- rendered at build time.
    // If fallback is 'blocking', then new paths will be server-side rendered with getStaticProps,
    // and cached for future requests so it only happens once per path.
    fallback: false
  }
}

// To create a custom 404 page, create pages/404.js.
// This file is statically generated at build time.
// // pages/404.js
// export default function Custom404() {
//   return <h1>404 - Page Not Found</h1>;
// }
// Take a look at Error Pages documentation to learn more.
// https://nextjs.org/docs/advanced-features/custom-error-page

export async function getStaticProps({ params }) {
  // update getStaticProps in pages/posts/[id].js to use
  // await when calling getPostData
  // Add the "await" keyword like this:
  // const postData = getPostData(params.id)

  const postData = await getPostData(params.id)
    return {
      props: {
        postData
      }
    }
}