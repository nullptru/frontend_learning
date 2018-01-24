import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const Index = (props) => (
    <Layout>
        <h1>Hello Next.js</h1>
        <ul>
            {props.shows.map((anima) => {
                return (
                    <li key={anima.id}>
                        <Link as={`/p/${anima.id}`} href={`/post?id=${anima.id}`}>
                            <a>{anima.attributes.canonicalTitle}</a>
                        </Link>
                    </li>
                );
            })}
        </ul>
   </Layout>
);

Index.getInitialProps = async function() {
    let data = [];
    try{
        const res = await axios.get('https://kitsu.io/api/edge/trending/anime?limit=20');
        data = res.data.data || [];
        console.log(`Show data fetched. Count: ${data.length}`);
      
    } catch(e) {}
    return {
      shows: data,
    };
}

export default Index;
