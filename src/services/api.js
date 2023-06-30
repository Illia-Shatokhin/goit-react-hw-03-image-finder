import axios from 'axios';

export async function fetchImagesWithQuery(query, page) {
  const response = await axios.get(
    `https://pixabay.com/api/?q=${query}&page=${page}&key=36560074-bb43b489ed70be2851a43808b&image_type=photo&orientation=horizontal&per_page=12`
  );
  return { response: response.data.hits, totalHits: response.data.totalHits };
}
