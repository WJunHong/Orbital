import React from "react";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import styles from "./App.css";
import Background from "./components/Background"
import { css } from "@emotion/react";

const Loading = ({loading}) => {
  const override = css`
  width: 100%;
  height: 100vh;
  display: block;
  justify-content: center;
  align-items: center;
  background-color: #121212;
  color: #F08D10;
`;

  return (
      <Background>
        <ClimbingBoxLoader color={"#F08D10"} size={30} className={styles.loadingBG} loading={loading} css={override} speedMultiplier={1}/>;
      </Background>
  );
};
export default Loading;
