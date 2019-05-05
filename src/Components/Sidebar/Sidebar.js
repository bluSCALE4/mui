import React, { Fragment } from 'react';
import { Link } from "react-router-dom";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

const Sidebar = ({classes, menuGroups}) => {
  return (
    <List component="nav">
      {menuGroups.map(({path, name}, i, xs) => (
        <Fragment key={i}>
          <ListItem component={Link} to={path} button>
            {name}
          </ListItem>
          {i !== xs.length - 1 && <Divider />}
        </Fragment>
      ))}
    </List>
  );
}

// Sidebar.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default Sidebar;