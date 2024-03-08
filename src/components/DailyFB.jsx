import React, { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import axios from "axios";

import { fetchTodayRepeats } from "../db/services";

const DailyFB = () => {
  const [inputText, setInputText] = useState("");
  const [feedback, setFeedback] = useState("");
  const API_KEY = "AIzaSyC2xzR5vDVn4a7cjtqDq_uQciPvZ3E9Ls8";

  const handleSendRequest = async () => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text:
                    inputText +
                    "Đưa ra cho tôi một số phản hồi về việc hoàn thành các Habit trong ngày hôm qua. Và những điều cần cải thiện. Đưa ra câu trả lời không quá dài, khoảng 4-5 câu.",
                },
              ],
            },
          ],
        }
      );
      setFeedback(response.data?.candidates?.[0]?.content?.parts?.[0]?.text);
      // console.log(response.data?.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
      } else {
        console.error(error.message);
      }
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nhập % hoàn thành của các Habit"
        value={inputText}
        onChangeText={setInputText}
        style={{
          height: 100,
          borderColor: "gray",
          borderWidth: 1,
          margin: 10,
          padding: 10,
        }}
      />
      <Button title="Gửi yêu cầu" onPress={handleSendRequest} />
      <Text style={{ margin: 10 }}>{feedback}</Text>
    </View>
  );
};

export default DailyFB;
