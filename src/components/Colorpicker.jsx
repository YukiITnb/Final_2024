import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
} from 'react-native';

import { PastelColors } from '../constants/theme';
import { useProgressStore } from '../store/progressStore';

const CIRCLE_SIZE = 40;
const CIRCLE_RING_SIZE = 2;

export default function Example() {
    const colors = PastelColors;
    const [value, setValue] = React.useState(0);
    const setColor = useProgressStore((state) => state.setColor);
    const color = useProgressStore((state) => state.color);

    return (
        <View style={{ flex: 1, marginTop: 12 }}>
            <View style={styles.group}>
                {colors.map((item, index) => {
                    const isActive = value === index;
                    return (
                        <View key={item}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    setValue(index);
                                    setColor(item);
                                }}>
                                <View
                                    style={[
                                        styles.circle,
                                        isActive && { borderColor: item },
                                    ]}>
                                    <View
                                        style={[styles.circleInside, { backgroundColor: item }]}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    group: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    circle: {
        width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
        height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
        borderRadius: 9999,
        backgroundColor: 'white',
        borderWidth: CIRCLE_RING_SIZE,
        borderColor: 'transparent',
        marginRight: 8,
        marginBottom: 12,
    },
    circleInside: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: 9999,
        position: 'absolute',
        top: CIRCLE_RING_SIZE,
        left: CIRCLE_RING_SIZE,
    },
});