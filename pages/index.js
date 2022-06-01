import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {GraphQLClient, gql} from 'graphql-request'
import BlogCard from '../components/BlogCard'

const graphQLCMS = new GraphQLClient(
  "https://api-ap-south-1.graphcms.com/v2/cl3tua5xscl2l01z666kw4njj/master"
  );

  const QUERY =  gql`
  {
    posts {
      id,
      title,
      content {
        html
      },
      slug,
      datePublished,
      coverphoto{
        url
      },
      author{
        name,
        username,
        avatar{
          url
        }
      }
    }
  }
  `;

export async function getStaticProps(){
  const {posts} = await graphQLCMS.request(QUERY);

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
}
export default function Home({posts}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Simply Blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {posts.map(
          (post) => (
            <BlogCard
              title={post.title}
              author = {post.author}
              coverPhoto={post.coverphoto}
              key={post.id}
              datePublished={post.datePublished}
              slug={post.slug}
            />
          )
        )}
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}
