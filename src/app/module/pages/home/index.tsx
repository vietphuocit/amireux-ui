import { Header, Nav, Footer } from 'app/module/layouts/index';
import { Slider, Content } from 'app/module/pages/home/components';

const Home = () => {
  return (
    <>
      <Header />
      <Nav />
      <Slider />
      <Content />
      <Footer />
    </>
  );
};

export { Home };
