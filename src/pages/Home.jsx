import { useLoaderData } from "react-router-dom";
import axios from "axios";

const cocktailSearchUrl =
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("search") || "";

  try {
    const { data } = await axios(`${cocktailSearchUrl}${searchTerm}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

function Home() {
  const { drinks } = useLoaderData();

  return <main></main>;
}
export default Home;
