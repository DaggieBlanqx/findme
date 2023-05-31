import React from "react";
import * as eva from "@eva-design/eva";
import {ApplicationProvider, Layout} from "@ui-kitten/components";
import LandingScreen from "./src/screens/LandingScreen.jsx";

export default () => (
    <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <LandingScreen />
        </Layout>
    </ApplicationProvider>
);
