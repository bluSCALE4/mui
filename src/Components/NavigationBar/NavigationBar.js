import React, { useState, useEffect } from 'react';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';



function NavigationBar({tabs, tabId, setTab}) {
  const [tabIndex, setTabIndex] = useState();

  useEffect(() => {
    setTabIndex(tabs.map(({id}) => id).indexOf(tabId));
  }, [tabs, tabId]);

  function handleChange(e, tabId) {
    setTab(tabs[tabId].id);
  };

  return (tabIndex > -1 
    ? <Paper>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {tabs.map(({id, name}) => (
          <Tab key={id} label={name} />
        ))}
      </Tabs>
    </Paper>
    : null
  );
}

export default NavigationBar;