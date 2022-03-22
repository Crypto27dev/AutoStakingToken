const api = {
    rootUrl: window.location.origin,
    baseUrl: 'http://localhost:5000/api', //mock data base folder
    imgUrl: "http://localhost:5000/uploads/",
    user: '/users',
    utils: '/utils',
    collection: '/collection',
    nfts: '/item',
    nftShowcases: '/nft_showcases.json',
    authors: '/authors.json',
    authorsSales: '/author_ranks.json',
    hotCollections: '/collection/get_hot_collections',
    contactUs: '/contact-forms',
    blogs: '/blog-posts',
    recent: '/blog-posts/recent.json',
    comments: '/blog-posts/comments.json',
    tags: '/blog-posts/tags.json',
    collectionRank: '/collection/get_collection_rank'
}

export default api;