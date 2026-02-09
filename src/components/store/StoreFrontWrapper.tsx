import StoreFront from './StoreFront';
import { useProducts } from '../admin/DataLoader';

export default function StoreFrontWrapper() {
	const products = useProducts();
	return <StoreFront products={products} />;
}



