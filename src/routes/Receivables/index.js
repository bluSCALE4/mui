import Loadable from 'react-loadable';

import Loading from 'Components/Loading';

export const Create = Loadable({
	loader: () => import('Components/Create'),
	loading: Loading
});