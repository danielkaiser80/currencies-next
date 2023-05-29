import Calculator from "../components/Calculator";
import Heading from "../components/Heading";
import { fetchAllIsoCodes } from "../service/BackendService";

export interface HomeProps {
  isoCodes: string[];
}

const Home = ({ isoCodes }: HomeProps) => (
  <>
    <Heading />
    <Calculator isoCodes={isoCodes} />
  </>
);

export async function getStaticProps() {
  const isoCodes = await fetchAllIsoCodes();
  return {
    props: {
      isoCodes,
    },
  };
}

export default Home;
