import Head from "next/head";
import {GraphQLClient, gql} from "graphql-request";
import styles from "../../styles/Slug.module.css";

const graphQLCMS = new GraphQLClient(
    "https://api-ap-south-1.graphcms.com/v2/cl3tua5xscl2l01z666kw4njj/master"
    );
  
    const QUERY =  gql`
    query Post($slug:String!){
        post(where: {slug:$slug}){
            id,
            title,
            slug,
            datePublished,
            author{
                id,
                name,
                avatar{
                    url
                }
            }
            content{
                html
            }
            coverphoto{
                id,
                url
            }
        }
    }
    `;

    const SLUGLIST = gql `
    {
        posts{
            slug
        }
    }
    `
export async function getStaticPaths(){
    const {posts} = await graphQLCMS.request(SLUGLIST);
    return {
        paths: posts.map((post) => ({ params: {slug: post.slug}})),
        fallback: false
    }
}
export async function getStaticProps({params}){
    const slug = params.slug;
    const data = await graphQLCMS.request(QUERY, {slug});
    const post = data.post;

    return {
        props: {
        post,
        },
        revalidate: 10,
    };
    }

export default function BlogPost({post}){

    return (
        <main className={styles.blog}>
            <img src={post.coverphoto? post.coverphoto.url: ''} className={styles.cover} alt="" />
            <div className={styles.title}>
                <div className={styles.authdetails}>
                    <img src={post.author.avatar? post.author.avatar.url: ''} alt={post.author.name} />
                    <div className={styles.authtext}>
                        <h6>By {post.author.name}</h6>
                        <h6 className={styles.date}>{post.datePublished}</h6>
                    </div>
                </div>
                <h1>{post.title}</h1>
            </div>
            <div className={styles.content} dangerouslySetInnerHTML={{__html: post.content.html}}></div>
        </main>
    )
}