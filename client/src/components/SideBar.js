// Imports
import React, { Fragment } from 'react';

import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

/**
 * A functional component representing a side bar
 * @returns JSX of a sidebar component
 */
function SideBar() {
    return (
      <div className="side_bar">
        <Navigation
            // Path to be added
            // activeItemId="/management/members"
            onSelect={({itemId}) => {
              // maybe push to the route
            }}
            items={[
              {
                title: 'Overview',
                itemId: '/overview',
                // elemBefore: () => <Icon name="inbox" />,
              },
              {
                title: 'Calendar',
                itemId: '/calendar',
                // elemBefore: () => <Icon name="inbox" />,
              },
              {
                title: 'Lists',
                itemId: '/lists',
                // elemBefore: () => <Icon name="users" />,
                subNav: [
                  {
                    title: 'Main Tasks',
                    itemId: '/lists/maintasks',
                  },
                  {
                    title: 'GER1000',
                    itemId: '/lists/ger1000',
                  },
                ],
              }
            ]}
          />
      </div>
    );
}

export default SideBar;
