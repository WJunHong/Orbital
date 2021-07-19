import React from "react";

//style imports
import styles from "./Overview.module.css";

import "../../design/TaskBox.css";
import TabName from "../TabName";
import TabBody from "../TabBody";
import Background from "../Background";
import TaskTables from "../TaskTables";

/**
 * The overall component for the overview page.
 * @returns A functional component representing the overview.
 */
const Overview = () => {
  // Future -> Overview highlighted when on the page
  return (
    <Background>
      <TabName name={"Overview"}></TabName>
      <TabBody>
        <TaskTables name={"Ov"} />
      </TabBody>
      <div className={styles.bottom}></div>
    </Background>
  );
};

export default Overview;
