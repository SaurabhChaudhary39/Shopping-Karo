import {Helmet} from "react-helmet-async"

const Meta = ({title, description, keywords}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name="keywords" content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to Shopping Karo',
  description: "We offer a wide range of top-quality products at competitive prices",
  keywords: 'ecommerce, buy products, sell products, online shopping',
};

export default Meta