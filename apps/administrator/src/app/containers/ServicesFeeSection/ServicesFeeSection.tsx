import React from "react";
import { Paper } from "@material-ui/core";
import "./ServicesFeeSection.css";

export const ServicesFeeSection = (props) => (
    <Paper className="ServicesFeeSection">{props.children}</Paper>
);
