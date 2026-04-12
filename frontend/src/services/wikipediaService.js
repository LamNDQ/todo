import axios from 'axios'

const BASE_URL = 'https://en.wikipedia.org/w/api.php'

export const searchWikipedia = async (query) => {
    const { data } = await axios.get(BASE_URL, {
        params: {
            action: 'query',
            list: 'search',
            srsearch: query,
            format: 'json',
            origin: '*',
            srlimit: 10,
            srprop: 'snippet',
        },
    })
    return data.query.search
}
