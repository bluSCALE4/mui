import { mount, route /*, withView */} from 'navi';

const formatNavigationToRoutes = (xs) =>
  xs
    .map(({menuGroups}) => menuGroups)
    .flat()
    .reduce((xs, {path, name}, i) => ({
      ...xs,
      [path]: route({
          title: name,
          getView: () => import(`Components/${name}`)
      })
    }), [])

export default (navigation) =>
  mount(
    formatNavigationToRoutes(navigation)
  );