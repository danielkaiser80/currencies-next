import Calculator from "../components/Calculator";
import Heading from "../components/Heading";
import {
  FALLBACK_ISO_CODES,
  fetchAllIsoCodes,
} from "../service/BackendService";

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
  try {
    return { props: { isoCodes: await fetchAllIsoCodes() } };
  } catch (error) {
    console.log(error);
    return { props: { isoCodes: FALLBACK_ISO_CODES } };
  }
}

export default Home;
