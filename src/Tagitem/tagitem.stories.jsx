import React from "react";
import { action } from "@storybook/addon-actions";
import { PSATagitem } from "./tagitem";

const sampleGoal = {
  label: "Cover Crop",
  description: "Helps suppress weeds and protect soil moisture.",
};

const commonArgs = {
  id: 1,
  goal: sampleGoal,
  goalTitle: sampleGoal.label,
  goalDescription: sampleGoal.description,
  historyStateEnum: { imported: "imported", updated: "updated" },
  historyStateRedux: "imported",
  pirschAnalytics: action("pirschAnalytics"),
  addSelectedGoals: action("addSelectedGoals"),
  updateSelectedGoal: action("updateSelectedGoal"),
  setHistoryState: action("setHistoryState"),
};

export default {
  title: "Components/PSATagitem",
  component: PSATagitem,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export const Default = {
  args: {
    ...commonArgs,
    selectedGoalsRedux: [],
  },
};

export const Selected = {
  args: {
    ...commonArgs,
    selectedGoalsRedux: ["Cover Crop"],
  },
};

export const Disabled = {
  args: {
    id: 2,
    goal: {
      label: "Soil Health",
      description: "Improve soil structure and nutrient content.",
    },
    goalTitle: "Soil Health",
    goalDescription: "Improve soil structure and nutrient content.",
    historyStateEnum: { imported: "imported", updated: "updated" },
    historyStateRedux: "imported",
    pirschAnalytics: action("pirschAnalytics"),
    addSelectedGoals: action("addSelectedGoals"),
    updateSelectedGoal: action("updateSelectedGoal"),
    setHistoryState: action("setHistoryState"),
    selectedGoalsRedux: ["A", "B", "C"],  // length ≥3 → disabled
  },
};
