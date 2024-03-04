import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import axios from 'axios';

import { fetchTodayRepeats } from '../db/services';

const DailyFB = () => {
  const [inputText, setInputText] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSendRequest = async () => {
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        prompt: inputText + "\n\nFeedback và lời khuyên của GPT: ",
        max_tokens: 100
      }, {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        }
      });
      setFeedback(response.data.choices[0].text);
    } catch (error) {
        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message); // Xem xét hiển thị thông báo lỗi chung
        }
  }
  };

  return (
    <View>
      <TextInput
        placeholder="Nhập % hoàn thành của các Habit"
        value={inputText}
        onChangeText={setInputText}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 10 }}
      />
      <Button title="Gửi yêu cầu" onPress={handleSendRequest} />
      <Text style={{ margin: 10 }}>{feedback}</Text>
    </View>
  );
};

export default DailyFB;
