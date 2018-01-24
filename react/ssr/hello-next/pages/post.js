import React from 'react';
import axios from 'axios';
import fetch from 'isomorphic-unfetch'
import Layout from '../components/Layout';

const Post = props => (
    <Layout>
        <h1>{props.attributes.canonicalTitle}</h1>
        <p>{props.attributes.synopsis.replace(/<[/]?p>/g, '')}}</p>
        <img src={props.attributes.posterImage.medium} />
    </Layout>
);

Post.getInitialProps = async context => {
    const { id } = context.query;
    const res = await axios({
        method: 'get',
        url: `https://kitsu.io/api/edge/anime/${id}`,
    });
    const anime = res.data.data;

    console.log(`Fetched show: ${anime.attributes.canonicalTitle}`);
    return anime;
}

export default Post;

