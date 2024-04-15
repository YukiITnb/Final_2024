import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput } from "react-native";
import axios from "axios";

import { getTodayDailyReport } from "../db/services";

function formatParagraph(text) {
  let formattedText = text.replace(/\*\*/g, "").replace(/\*/g, "").trim();
  let sections = formattedText.split(/\n\n+/);

  let formattedSections = sections.map((section) => {
    let lines = section.split("\n");
    let formattedLines = lines.map((line) => line.trim()).join("\n");
    return formattedLines;
  });

  let result = formattedSections.join("\n\n");

  return result;
}

const DailyFB = ({ date }) => {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    getTodayDailyReport(date).then((data) => {
      setFeedback(formatParagraph(data));
    });
  }, [date]);

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ margin: 10 }}>{feedback}</Text>
    </View>
  );
};

export default DailyFB;
